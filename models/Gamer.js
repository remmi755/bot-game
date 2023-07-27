import mongoose from 'mongoose';

const GamerShema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
        unique: true,
        defaultValue: 1,
        autoIncrement: true
    },
    chatId: {
        type: String,
        require: true,
    },
    right: {
        type: Number,
        require: true,
        defaultValue: 0
    },
    wrong: {
        type: Number,
        require: true,
        defaultValue: 0
    }
})

export default mongoose.model('Gamer', GamerShema)