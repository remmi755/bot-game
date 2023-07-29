import mongoose from 'mongoose';

const connectMongoDB = mongoose.connect('mongodb+srv://remmi:wwwwww@cluster0.j5xu8.mongodb.net/gamer')
    .then(() => {
        console.log("DB ok")
    }).catch((err) => {
    console.log("error", err)
})

export default connectMongoDB