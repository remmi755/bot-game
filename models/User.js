const mongoose = require('mongoose');

const UserShema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    chatId: {
        type: Number,
        require: true
    },
    right: {
        type: Number,
        require: true
    },
    wrong: {
        type: Number,
        require: true
    }
})