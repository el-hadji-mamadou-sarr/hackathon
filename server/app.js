const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = 7000
const cors = require('cors')
const jwt = require('jsonwebtoken');


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.json())



const dbUrl = process.env.DB_URL
mongoose.set('strictQuery', false)
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', (error) => console.log('connected to database'))

const TokenSchema = new mongoose.Schema({
    user_uid: String,
    token: String,
});



const Token = mongoose.model('token', TokenSchema);
app.post('/validateHash', async (req, res) => {
    const { hash } = req.body;
    console.log(hash)
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
        const newToken = new Token({ user_uid, hash: token });
        await newToken.save();

        res.json({ token });
    } catch (error) {
        console.error('Error saving token:', error);
        res.status(500).json({ error: 'Error saving token' });
    }
});



app.listen(port, () => {
    console.log("server is listening at port " + port)
})

