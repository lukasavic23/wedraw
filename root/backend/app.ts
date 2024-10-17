import express from "express";
import authRouter from "./router/authRouter";
import cors from "cors";
import cookieParser from "cookie-parser";
import CustomError from "./utils/CustomError";
import { globalErrorHandler } from "./controllers/errorController";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.use("/api/v1/users", authRouter);

// handle unhandled routes
app.all("*", (req, _, next) => {
  const error = new CustomError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(error);
});
app.use(globalErrorHandler);

export default app;
