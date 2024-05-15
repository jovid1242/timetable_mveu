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
