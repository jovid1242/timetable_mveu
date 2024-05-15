require("dotenv").config();
const { google } = require("googleapis");

async function getSheetTitle(spreadsheetId) {
  const sheets = google.sheets({ version: "v4", auth: process.env.API_KEY });

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetsData = response.data.sheets;
    return sheetsData;
  } catch (err) {
    console.error("Ошибка при получении данных:", err);
  }
}

module.exports = getSheetTitle;
