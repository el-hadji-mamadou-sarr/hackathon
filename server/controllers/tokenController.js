const Token = require('../models/Token');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

async function createToken(req, res) {
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
}


async function validateHash(req, res) {
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
};

module.exports = ({ createToken, validateHash }); 
