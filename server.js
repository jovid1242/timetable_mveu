require("dotenv").config(); 
const Bot = require("./bot");
const polling = process.env.APP_MODE === "local";
Bot.init(polling);
Bot.launch();
