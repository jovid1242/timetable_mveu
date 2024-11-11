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
      {
        text: "Численные методы",
        web_app: { url: `${process.env.APP_URL}/dichotomy_method` },
      },
    ],
  ],
};

module.exports.getButtons = (chatId) => {
  return BUTTONS.default(chatId);
};
