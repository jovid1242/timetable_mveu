const TelegramBot = require("node-telegram-bot-api");
const { getButtons } = require("./utils/buttons");
const getSheetTitle = require("./utils/getGroupName");
const groupHandler = require("./handlers/groupHandlers");
const getSheetData = require("./utils/getSheetData");
const {
  addDataToJson,
  findDataByChatId,
  checkChatIdExists,
  updateDataInJson,
} = require("./utils/saveToJson");
const formatRangeLesson = require("./utils/formatLesson");

const token = process.env.BOT_TOKEN;
const clientUrl = process.env.CLIENT_URL;
const url = process.env.APP_URL;

class Bot {
  init(polling = false) {
    this.bot = new TelegramBot(token, { polling });
    if (!polling) {
      this.bot.setWebHook(`${url}/bot${token}`);
    }
    return this.bot;
  }

  launch() {
    this.bot.on("callback_query", async (msg) => {
      const data = msg.data.split("____");
      var chatId = msg.from.id;

      if (data[0] === "course") {
        if (checkChatIdExists(chatId)) {
          updateDataInJson(chatId, {
            spreadsheetId: process.env[data[1]],
          });

          const groups = await getSheetTitle(process.env[data[1]]);
          const res = groupHandler.handleShowGroups(groups, data[1]);
          return await this.bot.sendMessage(chatId, res.text, res.buttons);
        }
      } else {
        if (checkChatIdExists(chatId)) {
          updateDataInJson(chatId, {
            range: data[0],
          });

          const dataSheets = await getSheetData(
            data[0],
            process.env[data[1]],
            "all"
          );

          return this.bot.sendMessage(
            chatId,
            formatRangeLesson(data[0], process.env[data[1]], dataSheets),
            {
              parse_mode: "HTML",
            }
          );
        }
      }
    });

    this.bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      // start
      if (text === "/start") {
        if (!checkChatIdExists(chatId)) {
          addDataToJson({
            chatId,
            detail: {
              range: "",
              spreadsheetId: "",
            },
          });
        }
        const user = findDataByChatId(chatId);

        if (
          (!user?.detail?.range && !user?.detail?.spreadsheetId) ||
          (user?.detail?.range === "" && user?.detail?.spreadsheetId === "")
        ) {
          const res = groupHandler.handleSelectCourse(chatId);
          this.bot.sendMessage(chatId, res.text, res.buttons);
        } else {
          const dataSheets = await getSheetData(
            user.detail.range,
            user.detail.spreadsheetId,
            "all"
          );

          return this.bot.sendMessage(
            chatId,
            formatRangeLesson(
              user?.detail?.range,
              user?.detail?.spreadsheetId,
              dataSheets
            ),
            {
              parse_mode: "HTML",
              reply_markup: {
                keyboard: getButtons(chatId),
                resize_keyboard: true,
              },
            }
          );
        }
      }

      if (text === "Изменить") {
        const res = groupHandler.handleSelectCourse(chatId);
        return this.bot.sendMessage(chatId, res.text, res.buttons);
      }

      if (text === "Расписание на сегодня") {
        if (checkChatIdExists(chatId)) {
          const user = findDataByChatId(chatId);

          const today = new Date();

          const daysOfWeek = [
            "воскресенье",
            "понедельник",
            "вторник",
            "среда",
            "четверг",
            "пятница",
            "суббота",
          ];

          const dayIndex = today.getDay();
          const dayName = daysOfWeek[dayIndex];
          const dataSheets = await getSheetData(
            user.detail.range,
            user.detail.spreadsheetId,
            dayName
          );

          return this.bot.sendMessage(
            chatId,
            formatRangeLesson(
              user?.detail?.range,
              user?.detail?.spreadsheetId,
              dataSheets
            ),
            {
              parse_mode: "HTML",
              reply_markup: {
                keyboard: getButtons(chatId),
                resize_keyboard: true,
              },
            }
          );
        } else {
          const res = groupHandler.handleSelectCourse(chatId);
          return this.bot.sendMessage(chatId, res.text, res.buttons);
        }
      }

      if (text === "На этой неделе") {
        if (checkChatIdExists(chatId)) {
          const user = findDataByChatId(chatId);
          const dataSheets = await getSheetData(
            user.detail.range,
            user.detail.spreadsheetId,
            "all"
          );

          return this.bot.sendMessage(
            chatId,
            formatRangeLesson(
              user?.detail?.range,
              user?.detail?.spreadsheetId,
              dataSheets
            ),
            {
              parse_mode: "HTML",
              reply_markup: {
                keyboard: getButtons(chatId),
                resize_keyboard: true,
              },
            }
          );
        }
      }
    });
  }
}

module.exports = new Bot();
