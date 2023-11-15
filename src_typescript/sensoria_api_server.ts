import dotenv from 'dotenv';
dotenv.config();

import api from "./api";

const PORT = process.env.PORT || 3000;
export const API_VERSION = "0.1.0";

console.log("########################## Sensoria API Version: " + API_VERSION + " ##########################");
console.log(" ");
console.log("Starting on Port: " + PORT + " ...");
console.log(" ");
console.log(((process.env.CONSOLE_LOG_REQUESTS == 'true')   ? "✅" : "❌" ) + " Request Logging");
console.log(((process.env.SEQUELIZE_LOG == 'true')          ? "✅" : "❌" ) + " Sequelize Logging");
console.log(" ");

console.log("Starting Server...")
api.start(String(PORT)).catch((error) =>
    console.error("API crashed with Error:\n" + error)
)
