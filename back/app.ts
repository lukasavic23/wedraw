import express, { Express } from "express";
import authRouter from "./router/authRouter";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/users", authRouter);

export default app;
