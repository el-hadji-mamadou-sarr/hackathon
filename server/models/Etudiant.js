const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
}, { timestamps: true });

const Etudiant = mongoose.model('Etudiant', etudiantSchema);
module.exports = Etudiant;
