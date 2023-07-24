const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '6241235002:AAGO54nNg5GlKS5VJBjnkr1wQiFpRUNRmvk'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадываю цифру от 0 до 9, а ты должен ее угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        // console.log(msg)
        const text = msg.text;
        const chatId = msg.chat.id;

        bot.setMyCommands([
            {command: '/start', description: 'Начальное приветствие'},
            {command: '/info', description: 'Получить информацию о пользователе'},
            {command: '/game', description: 'Игра: Угадай цифру'},
        ])

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/7.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в чат Романа ${text}`)
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return await startGame(chatId)
        }

        if (data === chats[chatId].toString()) {
            return await bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, ` К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start();