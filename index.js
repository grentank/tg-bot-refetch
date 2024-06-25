const { Telegraf } = require('telegraf');
const randomTime = require('./randomTime');
const fetchAfterTime = require('./fetchAfterTime');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ONE_MINUTE = 1000 * 60;
const appState = {
  WHILE_FLAG: true,
  howManyRequestsSent: 0,
  requestsAfterSuccess: 0,
  errors: 0,
  timeout: 0,
};

async function run(ctx) {
  while (appState.WHILE_FLAG) {
    if (appState.errors > 10) {
      appState.WHILE_FLAG = false;
      return ctx.reply('Превышено количество ошибок. Попробуйте позже.');
    }
    try {
      appState.timeout = randomTime(25 * ONE_MINUTE, 35 * ONE_MINUTE);
      appState.howManyRequestsSent++;
      const athletes = await fetchAfterTime(appState.timeout);
      if (athletes === 0) continue;
      else {
        appState.requestsAfterSuccess++;
        ctx.reply(`Появилось место! Свободно заявок: ${athletes}`);
        if (appState.requestsAfterSuccess >= 14) {
          appState.WHILE_FLAG = false;
          return ctx.reply('Слишком много ответов с успешными заявками! Завершение бота');
        }
      }
    } catch (error) {
      console.log(error);
      ctx.reply(`Возникла ошибка: ${error.message}`);
      appState.errors++;
    }
  }
}

bot.start((ctx) => {
  ctx.reply('Привет! Запускаю регулярные запросы на Гонку Героев');
  run(ctx);
});
bot.help((ctx) => {
  ctx.reply(
    `Бот, который помогает отследить места на Гонке Героев.\n
    /start - начать\n
    /help - данная инструкция\n
    Напиши data для данных приложения\n
    Напиши stop для остановки цикла`,
  );
});
bot.hears('data', (ctx) => ctx.reply(JSON.stringify(appState)));
bot.hears('stop', (ctx) => {
  appState.WHILE_FLAG = false;
  ctx.reply('Останавливаю цикл!');
});
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
