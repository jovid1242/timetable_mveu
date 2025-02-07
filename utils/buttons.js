const BUTTONS = {
  default: (chatId) => [
    [
      {
        text: "Расписание на сегодня",
      },
    ],
    [
      {
        text: "Изменить",
      },
      {
        text: "На этой неделе",
      },
    ],
  ],
};

module.exports.getButtons = (chatId) => {
  return BUTTONS.default(chatId);
};
