import express from "express";
import dotenv from "dotenv";
import path from "path";
import bootStrap from "./src/app.controller.js";
dotenv.config({ path: path.resolve("src/config/.env") });
const app = express();
const port = process.env.PORT;
bootStrap(express, app);
app.listen(port, () => {
  console.log(`Server is Running at ${port}`);
});
