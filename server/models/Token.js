const { Schema, default: mongoose } = require("mongoose");

const tokenSchema = new Schema({
    user_uid: { type: String, required: true },
    token: { type: String, required: true },
    expiryDate: { type: Date, required: true }
}, { timestamps: true });
const Token = mongoose.model('token', tokenSchema);
module.exports = Token