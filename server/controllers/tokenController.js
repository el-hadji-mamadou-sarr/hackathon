const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const Etudiant = require('../models/Etudiant')
const Locker = require('../models/Locker')
const SECRET_KEY = process.env.SECRET_KEY; // Load your secret key from environment variable

async function createToken(req, res) {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: 'first_name, last_name, and email are required' });
    }

    try {
        // Create a new student (etudiant)
        const newEtudiant = new Etudiant({ first_name, last_name, email, locker_number });
        await newEtudiant.save();

        console.log('New student created:', newEtudiant);
        const newLocker = new Locker({ locker_number: locker_number, user_uid: newEtudiant._id, status: 'closed' });
        await newLocker.save();
        // Generate token for the new student
        const payload = { user_id: newEtudiant._id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3m' });

        // Save the token to the token collection
        const newToken = new Token({
            user_uid: newEtudiant._id,
            token: token,
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
    try {
        const token = await Token.findOne({ user_uid: user_uid });

        if (!token) {
            console.log('Token not found.');
            return res.json({ valid: false, expired: false });
        }

        try {
            jwt.verify(token.token, SECRET_KEY);
            return res.status(200).send({
                valid: true,
                message: 'Token is valid'
            });
        } catch (err) {
            // Token is expired
            // update the token
            console.log('Token is expired:', err);
            const payload = { user_id: user_uid };
            const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '3m' });
            await Token.updateOne({ user_uid: user_uid }, { token: newToken });
            return res.status(200).send({
                valid: true,
                message: 'updated token'
            });
        }

    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).json({ valid: false, expired: false, error: 'Internal Server Error' });
    }
}


module.exports = { createToken, validateHash };