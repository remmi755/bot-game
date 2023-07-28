import express from "express"
import mongoose from 'mongoose';

import TelegramApi from 'node-telegram-bot-api';
import {gameOptions, againOptions} from './options.js';

import GamerModel from './models/Gamer.js';
import {createGamer} from "./controllers/GameControllers.js";

const app = express();
const token = '6241235002:AAGO54nNg5GlKS5VJBjnkr1wQiFpRUNRmvk'
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадываю цифру от 0 до 9, а ты должен ее угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = async () => {
    await mongoose.connect('mongodb+srv://remmi:wwwwww@cluster0.j5xu8.mongodb.net/gamer')
        .then(() => {
            console.log("DB ok")
        }).catch((err) => {
            console.log("error", err)
        })

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        bot.setMyCommands([
            {command: '/start', description: 'Начальное приветствие'},
            {command: '/info', description: 'Получить информацию о пользователе'},
            {command: '/game', description: 'Игра: Угадай цифру'},
        ])

            await createGamer(msg);

        const gamer = await GamerModel.findOne({chatId});

        try {
            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/7.webp')
                return bot.sendMessage(chatId, `Добро пожаловать в чат Романа ${text}`)
            }

            if (text === '/info') {
                const answer = await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''}, в игре у тебя правильных ответов: ${gamer.right}, неправильных: ${gamer.wrong}`)
                await GamerModel.findOneAndDelete({chatId})
                return answer
            }

            if (text === '/game') {
                return startGame(chatId)
            }

            return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая-то ошибка')
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return await startGame(chatId)
        }

        const gamer = await GamerModel.findOne({chatId})

        if (data === chats[chatId].toString()) {
            gamer.right += 1;
            await bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            gamer.wrong += 1;
            await bot.sendMessage(chatId, ` К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }

        await gamer.save();
    })
}

start();

app.listen(5555, (err) => {
    if (err) {
        console.log(err)
    }

    console.log('Server Ok')
})