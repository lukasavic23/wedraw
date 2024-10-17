import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("app is listening!");
});

if (process.env.DATABASE)
  mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("DB connection successful!");
    })
    .catch(() => {
      server.close(() => {
        process.exit();
      });
    });
