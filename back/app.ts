import express, { Express } from "express";
import userRouter from "./router/userRouter";

const app: Express = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);

export default app;
