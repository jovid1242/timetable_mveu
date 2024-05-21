const fs = require("fs");
const path = require("path");
var filePath = path.join(__dirname, "../db/user.json");

function saveDataToJson(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
  } catch (err) {
    console.error(`Ошибка сохранения данных: ${err}`);
  }
}

function readDataFromJson(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);
    if (!Array.isArray(data)) {
      throw new Error("Данные не являются массивом");
    }
    return data;
  } catch (err) {
    console.error(`Ошибка чтения данных из файла: ${err}`);
    return null;
  }
}

function updateDataInJson(chatId, updateData) {
  try {
    const data = readDataFromJson(filePath);
    if (data) {
      const record = data.find((item) => item.chatId === chatId);
      if (record) {
        if (record.detail) {
          Object.assign(record.detail, updateData);
        } else {
          record.detail = updateData;
        }
        saveDataToJson(data);
      } else {
        console.error(
          `Ошибка обновления данных: chatId ${chatId} не найден в ${filePath}`
        );
      }
    } else {
      console.error(
        `Ошибка обновления данных: данные не найдены в ${filePath}`
      );
    }
  } catch (err) {
    console.error(`Ошибка обновления данных: ${err}`);
  }
}

function addDataToJson(newData) {
  try {
    let data = readDataFromJson(filePath);
    data.push(newData);
    saveDataToJson(data);
  } catch (err) {
    console.error(`Ошибка добавления данных: ${err}`);
  }
}

function checkChatIdExists(chatId) {
  try {
    const data = readDataFromJson(filePath);
    const found = data.some((item) => item.chatId === chatId);
    return found;
  } catch (err) {
    console.error(`Ошибка проверки chatId: ${err}`);
    return false;
  }
}

function findDataByChatId(chatId) {
  try {
    const data = readDataFromJson(filePath);
    const foundItem = data.find((item) => item.chatId === chatId);
    return foundItem;
  } catch (err) {
    console.error(`Ошибка поиска данных: ${err}`);
    return undefined;
  }
}

module.exports = {
  readDataFromJson,
  updateDataInJson,
  addDataToJson,
  checkChatIdExists,
  findDataByChatId,
};
