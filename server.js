require("dotenv").config();
const express = require("express");
const cors = require("cors");

const Bot = require("./bot");
const getSheetData = require("./utils/getSheetData");
const PORT = process.env.PORT || 8112;

const polling = process.env.APP_MODE === "local";

Bot.init(polling);
const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/group", async (req, res) => {
  try {
    const { range, spreadsheetId, day } = req.query;
    console.log("range, spreadsheetId", range, spreadsheetId, day);
    const data = await getSheetData(range, spreadsheetId, day);
    function removeEmptySlots(schedule) {
      for (let day in schedule) {
        schedule[day] = schedule[day].filter((cls) =>
          cls.slice(4).some((item) => item !== "")
        );
      }
      return schedule;
    }

    res.json(removeEmptySlots(data));
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`APP app listening at http://localhost:${PORT}`);
});

Bot.launch();
