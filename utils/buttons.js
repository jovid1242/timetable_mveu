const BUTTONS = {
  default: (chatId) => [
    [
      {
        text: "Изменить",
      },
      {
        text: "Расписание на сегодня",
      },
    ],
    [
      {
        text: "На этой неделе",
      },
    ],
  ],
};

module.exports.getButtons = (chatId) => {
  return BUTTONS.default(chatId);
};
