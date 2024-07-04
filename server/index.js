const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 7000; // Use process.env.PORT for Vercel compatibility
const jwt = require('jsonwebtoken');
const Locker = require('./models/Locker')
const Token = require('./models/Token')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.json());

const dbUrl = process.env.DB_URL;
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.log('DB connection error:', error));
db.once('open', () => console.log('Connected to database'));

// Import and use your routes
const tokenRoutes = require('./routes/tokenRoutes');
app.use('/api', tokenRoutes); // Prefix routes with /api for better organization


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
app.post('/scan', async (req, res) => {
    const locker_number = req.body.locker_number;
    console.log('Scanning locker number', locker_number);
    const MAX_BACKOFF_TIME = 60 * 0.5 * 1000;
    let backoffTime = 1000;
    const startTime = Date.now();

    try {
        const locker = await Locker.findOne({ locker_number: locker_number });
        if (!locker) {
            return res.status(404).json({ message: 'Locker not found' });
        }

        while (true) {
            try {
                const tokenObject = await Token.findOne({ user_uid: locker.user_uid });
                if (!tokenObject) {
                    console.log('No token found for user');
                    if (Date.now() - startTime >= MAX_BACKOFF_TIME) {
                        return res.status(408).json({ message: 'Timeout, could not validate token' });
                    }
                    await sleep(backoffTime);
                    backoffTime = Math.min(backoffTime * 2, MAX_BACKOFF_TIME);
                    continue;
                }

                const token = tokenObject.token;
                try {
                    jwt.verify(token, process.env.SECRET_KEY);
                    return res.cookie('jwtToken', token, {
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: false, //we using http in our app (not recommended)
                        maxAge: 60 * 3 * 1000, // the expiration of the cookie (3 minutes)
                    }).status(200).json({ message: "authenticated" });
                } catch (err) {
                    if (err.name === 'TokenExpiredError') {
                        console.log('Token is expired:', err);
                    } else {
                        console.log('Token verification error:', err);
                    }
                    if (Date.now() - startTime >= MAX_BACKOFF_TIME) {
                        return res.status(408).json({ message: 'Timeout, could not validate token' });
                    }
                    await sleep(backoffTime);
                    backoffTime = Math.min(backoffTime * 2, MAX_BACKOFF_TIME);
                }
            } catch (err) {
                console.log('Error finding token:', err);
                if (Date.now() - startTime >= MAX_BACKOFF_TIME) {
                    return res.status(408).json({ message: 'Timeout, could not validate token' });
                }
                await sleep(backoffTime);
                backoffTime = Math.min(backoffTime * 2, MAX_BACKOFF_TIME);
            }
        }
    } catch (err) {
        console.log('Error finding locker:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/lockLocker', async (req, res) => {
    try {
        const locker_number = req.body.locker_number;
        const locker = await Locker.findOne({ locker_number: locker_number });
        await Token.updateOne({ user_uid: locker.user_uid }, { token: '' });
        res.json({ message: "ok" });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log('Server is listening at port ' + port);
});
