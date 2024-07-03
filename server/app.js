const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = 7000
const cors = require('cors')

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
    hash: String,
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
app.post('/createToken', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const payload = { name };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});


app.listen(port, () => {
    console.log("server is listening at port " + port)
})

