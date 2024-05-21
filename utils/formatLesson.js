var clientUrl = process.env.CLIENT_URL;

function formatRangeLesson(range, spreadsheetId, dataSheets) {
  function formatLesson(lesson) {
    const time = lesson[3];
    const subject = lesson[4];
    const teacher = lesson[5];
    const room = lesson[6] || "";

    if (
      time === undefined ||
      subject === undefined ||
      teacher === undefined ||
      room === undefined
    ) {
      return "";
    }

    return `${time}, <strong>${subject}</strong>, <u>${teacher}</u>, <b>${room}</b>`;
  }

  var formattedData = "";

  for (const day in dataSheets) {
    formattedData += `<b>${day}</b>: \n`;
    const lessons = dataSheets[day];
    lessons.forEach((lesson, index) => {
      const formattedLesson = !formatLesson(lesson)
        ? formatLesson(lesson)
        : `${index + 1}) ${formatLesson(lesson)}\n`;
      formattedData += formattedLesson;
    });
    formattedData += "\n";
  }
  formattedData += `<a href="${clientUrl}?range=${range}&spreadsheetId=${spreadsheetId}">Посмотреть на сайте</a>`;
  return formattedData;
}

module.exports = formatRangeLesson;
