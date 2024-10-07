import express, { Express } from "express";
import authRouter from "./router/authRouter";

const app: Express = express();

app.use(express.json());

app.use("/api/v1/users", authRouter);

export default app;
