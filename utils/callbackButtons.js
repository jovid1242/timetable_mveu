module.exports.getButtons = (groups, course) => {
  let Buttons = [];
  groups.forEach((sheet) => {
    Buttons.push([
      {
        text: sheet.properties.title,
        callback_data: `${sheet.properties.title}____${course}`,
      },
    ]);
  });

  return Buttons;
};

module.exports.getSelectCourseButtons = (chatId) => {
  let Buttons = [
    [
      {
        text: "курс 1",
        callback_data: "course____COURSE_ONE",
      },
      {
        text: "курс 2",
        callback_data: "course____COURSE_TWO",
      },
    ],
    [
      {
        text: "курс 3",
        callback_data: "course____COURSE_THERE",
      },
      {
        text: "курс 4",
        callback_data: "course____COURSE_FOUR",
      },
    ],
  ];

  return Buttons;
};
