const BUTTONS = {
  default: (chatId) => [
    [
      {
        text: "курс 1",
      },
      {
        text: "курс 2",
      },
    ],
    [
      {
        text: "курс 3",
      },
      {
        text: "курс 4",
      },
    ],
  ],
};

module.exports.getButtons = (chatId) => {
  return BUTTONS.default(chatId);
};
