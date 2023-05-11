const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default:'...'
    },
    age: {
        type: Number
    },
    avatar: {
        type: String,
        default: "no-photo.gif"
    },
    role:{
        type: Number,
        default: 0
    },
    date: {
        type: Date   ,
        default: Date.now,
        timezone: 'Europe/Amsterdam'
    }
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;