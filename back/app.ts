import express, { Express } from "express";
import userRouter from "./router/userRouter";

const appExpress: Express = express();

appExpress.use(express.json());

appExpress.use("/api/v1/users", userRouter);

export default appExpress;
