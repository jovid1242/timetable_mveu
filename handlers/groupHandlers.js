const { getButtons, getSelectCourseButtons } = require("../utils/callbackButtons");

class GroupHandler {
  handleShowGroups(groups, course) {
    return {
      text: `Выберите свою группу`,
      buttons: {
        reply_markup: {
          inline_keyboard: getButtons(groups, course),
          resize_keyboard: true,
        },
      },
    };
  }

  handleSelectCourse(chatId) {
    return {
      text: `"Хэйй! Добро пожаловать 🗓️, не нужно запоминать даты и время – я всегда готов помочь тебе с информацией о предстоящих занятиях. Просто выбери команду, и я предоставлю тебе актуальное расписание"
На каком курсе вы учитесь?`,
      buttons: {
        reply_markup: {
          inline_keyboard: getSelectCourseButtons(chatId),
          resize_keyboard: true,
        },
      },
    };
  }
}

module.exports = new GroupHandler();
