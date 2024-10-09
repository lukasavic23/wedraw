import express, { Express } from "express";
import authRouter from "./router/authRouter";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/users", authRouter);

export default app;
