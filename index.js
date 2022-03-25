require('dotenv').config()

const TelegramApi = require('node-telegram-bot-api')

const token = `${process.env.BOT_ID}:${process.env.BOT_TOKEN}`

const bot = new TelegramApi(token, { polling: true })

const chats = {}
const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '1', callback_data: '1' },
        { text: '2', callback_data: '2' },
        { text: '3', callback_data: '3' }
      ],
      [
        { text: '4', callback_data: '4' },
        { text: '5', callback_data: '5' },
        { text: '6', callback_data: '6' }
      ],
      [
        { text: '7', callback_data: '7' },
        { text: '8', callback_data: '8' },
        { text: '9', callback_data: '9' }
      ],
      [
        { text: '0', callback_data: '0' }
      ],
    ]
  })
}

const againOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 'Играть еще раз', callback_data: '/again' },
      ],
    ]
  })
}
const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}
const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Получить информацию' },
    { command: '/game', description: 'Игра "Угадай число"' },
  ])
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
      return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот`)
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Не понимать')
  })
  
  bot.on('callback_query', msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
    } else {
      return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
  })
}

start()