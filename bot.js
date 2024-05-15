const TelegramBot = require("node-telegram-bot-api");
const { getButtons } = require("./utils/buttons");
const getSheetTitle = require("./utils/getGroupName");
const groupHandler = require("./handlers/groupHandlers");
const getSheetData = require("./utils/getSheetData");

const token = process.env.BOT_TOKEN;

class Bot {
  init(polling = false) {
    this.bot = new TelegramBot(token, { polling });
    // if (!polling) {
    //   this.bot.setWebHook(`${url}/bot${token}`);
    // }
    return this.bot;
  }

  launch() {
    this.bot.on("callback_query", async (msg) => {
      const data = msg.data.split("____");
      var chatId = msg.from.id;

      const dataSheets = await getSheetData(data[0], process.env[data[1]]);
      function formatLesson(lesson) {
        const time = lesson[3];
        const subject = lesson[4];
        const teacher = lesson[5];
        const room = lesson[6] || ""; // Если нет данных о комнате, оставляем пустую строку

        if (
          time === undefined ||
          subject === undefined ||
          teacher === undefined ||
          room === undefined
        ) {
          return "";
        }

        return `${time}, <strong>${subject}</strong>, <u>${teacher}</u>, <u>${room}</u>`;
      }

      let formattedData = "";

      // Проходимся по каждому дню недели и форматируем записи
      for (const day in dataSheets) {
        formattedData += `<b>${day}</b>: \n`;
        const lessons = dataSheets[day];
        lessons.forEach((lesson, index) => {
          console.log(formatLesson(lesson));
          const formattedLesson =
            !formatLesson(lesson)
              ? formatLesson(lesson)
              : `${index + 1}) ${formatLesson(lesson)}\n`;
          formattedData += formattedLesson;
        });
        formattedData += "\n";
      } 

      return this.bot.sendMessage(chatId, formattedData, {
        parse_mode: "HTML",
      });
    });

    this.bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      // start
      if (text === "/start") {
        this.bot.sendMessage(chatId, "Хэйй!, не нужно запоминать даты и время – я всегда готов помочь тебе с информацией о предстоящих занятиях. Просто выбери команду, и я предоставлю тебе актуальное расписание", {
          reply_markup: {
            keyboard: getButtons(chatId),
            resize_keyboard: true,
          },
        });
      }

      if (text === "курс 1") {
        const groups = await getSheetTitle(process.env.COURSE_ONE);
        const res = groupHandler.handleShowGroups(groups, "COURSE_ONE");
        return await this.bot.sendMessage(chatId, res.text, res.buttons);
      }

      if (text === "курс 2") {
        const groups = await getSheetTitle(process.env.COURSE_TWO);
        const res = groupHandler.handleShowGroups(groups, "COURSE_TWO");
        return await this.bot.sendMessage(chatId, res.text, res.buttons);
      }

      if (text === "курс 3") {
        const groups = await getSheetTitle(process.env.COURSE_THERE);
        const res = groupHandler.handleShowGroups(groups, "COURSE_THERE");
        return await this.bot.sendMessage(chatId, res.text, res.buttons);
      }

      if (text === "курс 4") {
        const groups = await getSheetTitle(process.env.COURSE_FOUR);
        const res = groupHandler.handleShowGroups(groups, "COURSE_FOUR");
        return await this.bot.sendMessage(chatId, res.text, res.buttons);
      }
    });
  }
}

module.exports = new Bot();
