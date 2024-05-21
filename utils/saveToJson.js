const fs = require("fs");
const path = require("path");
var filePath = path.join(__dirname, "../db/user.json");

// Функция для сохранения данных в JSON файл
function saveDataToJson(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Преобразуем данные в JSON формат с отступами
    fs.writeFileSync(filePath, jsonData); // Записываем данные в файл
    console.log(`Данные успешно сохранены в ${filePath}`);
  } catch (err) {
    console.error(`Ошибка сохранения данных: ${err}`);
  }
}

// Функция для чтения данных из JSON файла
function readDataFromJson(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    if (!Array.isArray(data)) {
      throw new Error('Данные не являются массивом');
    }
    return data;
  } catch (err) {
    console.error(`Ошибка чтения данных из файла: ${err}`);
    return null;
  }
}

function updateDataInJson(chatId, updateData) {
  try {
    const data = readDataFromJson(filePath); // Читаем существующие данные
    if (data) {
      const record = data.find((item) => item.chatId === chatId);
      if (record) {
        // Обновляем вложенные данные
        if (record.detail) {
          Object.assign(record.detail, updateData);
        } else {
          record.detail = updateData;
        }
        saveDataToJson(data); // Сохраняем обновленные данные
        console.log(
          `Данные успешно обновлены для chatId ${chatId} в ${filePath}`
        );
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
    let data = readDataFromJson(filePath); // Читаем существующие данные
    data.push(newData); // Добавляем новые данные в массив
    saveDataToJson(data); // Сохраняем обновленные данные
    console.log(`Данные успешно добавлены в ${filePath}`);
  } catch (err) {
    console.error(`Ошибка добавления данных: ${err}`);
  }
}

// Функция для проверки наличия данных по chatId
function checkChatIdExists(chatId) {
  try {
    const data = readDataFromJson(filePath); // Читаем данные из файла
    const found = data.some((item) => item.chatId === chatId); // Проверяем наличие chatId в массиве
    return found;
  } catch (err) {
    console.error(`Ошибка проверки chatId: ${err}`);
    return false; // Возвращаем false, если возникла ошибка
  }
}

// Функция для поиска данных по chatId
function findDataByChatId(chatId) {
  try {
    const data = readDataFromJson(filePath); // Читаем данные из файла
    const foundItem = data.find((item) => item.chatId === chatId); // Находим объект с заданным chatId
    return foundItem; // Возвращаем найденный объект или undefined, если объект не найден
  } catch (err) {
    console.error(`Ошибка поиска данных: ${err}`);
    return undefined; // Возвращаем undefined, если возникла ошибка
  }
}

// Примеры использования:

// Сохранение данных
// const myData = { name: "John", age: 30 };
// saveDataToJson(dataFile, myData);

// Чтение данных
// const readData = readDataFromJson(dataFile);
// console.log(readData); // Вывод: { name: "John", age: 30 }

// // Обновление данных
// updateDataInJson(dataFile, { age: 35 });

module.exports = {
  readDataFromJson,
  updateDataInJson,
  addDataToJson,
  checkChatIdExists,
  findDataByChatId,
};
