const { getButtons } = require("../utils/callbackButtons");

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
}

module.exports = new GroupHandler();
