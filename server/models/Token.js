const { Schema, default: mongoose } = require("mongoose");

const tokenShema = new Schema({
    user_uid: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
}, { timestamps: true });
const Token = mongoose.model('token', tokenShema);
module.exports = Token