const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const Etudiant = require('../models/Etudiant')

const SECRET_KEY = process.env.SECRET_KEY; // Load your secret key from environment variable

async function createToken(req, res) {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: 'first_name, last_name, and email are required' });
    }

    try {
        // Create a new student (etudiant)
        const newEtudiant = new Etudiant({ first_name, last_name, email });
        await newEtudiant.save();

        console.log('New student created:', newEtudiant);

        // Generate token for the new student
        const payload = { user_id: newEtudiant._id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1m' });

        // Save the token to the token collection
        const newToken = new Token({
            user_uid: newEtudiant._id,
            token: token,
            expiryDate: new Date(Date.now() + 60 * 1000) // Set expiry 1 minute from now
        });
        await newToken.save();

        console.log('Token saved successfully:', newToken);

        // Return the user_id (etudiant._id)
        res.json({ user_uid: newEtudiant._id });

    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({ error: 'Error creating token' });
    }
}


async function validateHash(req, res) {
    const { user_uid } = req.body;
    console.log('Received hash:', user_uid);

    try {
        console.log('Searching for token in the database...');
        const token = await Token.findOne({ user_uid: user_uid });

        if (!token) {
            console.log('Token not found.');
            return res.json({ valid: false, expired: false });
        }

        console.log('Token found:', token);

        const currentTimestamp = new Date().getTime();
        const isExpired = token.expiryDate && token.expiryDate.getTime() < currentTimestamp;

        console.log(`Token ${isExpired ? 'expired' : 'valid and not expired'}.`);
        res.json({ valid: true, expired: isExpired });

    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).json({ valid: false, expired: false, error: 'Internal Server Error' });
    }
}


module.exports = { createToken, validateHash };