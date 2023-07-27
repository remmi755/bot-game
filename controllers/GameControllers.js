import UserModel from '../models/Gamer.js'

export const createGamer = async (msg) => {
    console.log("MSG", msg)
    try {
        const doc = new UserModel({
            id: 1,
            chatId: msg.chat.id,
            right: 0,
            wrong: 0
        })

        await doc.save()
    } catch (err) {
        console.log("Не удалось создать игрока", err)
    }
}