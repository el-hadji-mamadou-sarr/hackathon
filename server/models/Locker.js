const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lockerSchema = new Schema({
    locker_number: { type: Number, required: true },
    user_uid: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

const Locker = mongoose.model('Locker', lockerSchema);
module.exports = Locker;
