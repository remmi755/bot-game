import UserModel from '../models/Gamer.js'
import GamerModel from "../models/Gamer.js";

export const createGamer = async (msg) => {
    try {
        const doc = new UserModel({
            userName: msg.from.first_name,
            id: msg.message_id,
            chatId: msg.chat.id,
            right: 0,
            wrong: 0
        })

        await doc.save()
    } catch (err) {
        console.log("Не удалось создать игрока", err)
    }
}