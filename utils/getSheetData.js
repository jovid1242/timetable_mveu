require("dotenv").config();
const { google } = require("googleapis");

async function getSheetData(range, spreadsheetId) {
  const sheets = google.sheets({ version: "v4", auth: process.env.API_KEY });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: range + "!A:G",
    });

    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    let data = [];
    let day = "";
    let dayDate = "";
    response.data.values.forEach((row) => {
      if (row[0] && row[1]) {
        day = row[0];
        dayDate = row[1];
      }
      row[0] = day;
      row[1] = dayDate;
      data = [...data, row];
    });

    const filteredData = data.filter((row) => {
      const [day, month, year] = row[1].split(".").map(Number);
      const rowDate = new Date(year, month - 1, day);

      return rowDate >= startOfWeek && rowDate <= endOfWeek;
    });

    const newData = {};

    filteredData.forEach((row) => {
      if (!newData[row[0]]) {
        newData[row[0]] = [];
      }
      newData[row[0]].push(row);
    });

    // console.log("Данные с понедельника до субботы текущей недели:", newData);
    return newData;
  } catch (err) {
    console.error("Ошибка при получении данных:", err);
  }
}

module.exports = getSheetData;
