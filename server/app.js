const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 7000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
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



app.post('/validateHash', async (req, res) => {
    const { hash } = req.body;
    console.log(hash);
    try {
        const hashEntry = await Token.findOne({ user_uid: hash });
        if (hashEntry) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error validating hash:', error);
        res.status(500).json({ valid: false });
    }
});

const SECRET_KEY = process.env.SECRET_KEY;

app.post('/createToken', async (req, res) => {
    const { user_uid } = req.body;
    if (!user_uid) {
        return res.status(400).json({ error: 'user_uid is required' });
    }

    const payload = { user_uid };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    
    try {
        console.log('Creating new token for user_uid:', user_uid);
        const newToken = new Token({ user_uid: user_uid, token: token });
        await newToken.save();
        console.log('Token saved successfully:', newToken);
        res.json({ newToken });
    } catch (error) {
        console.error('Error saving token:', error);
        res.status(500).json({ error: 'Error saving token' });
    }
});

app.listen(port, () => {
    console.log('Server is listening at port ' + port);
});
