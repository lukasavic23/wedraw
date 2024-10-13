import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/CustomError";

const handleJWTExpiredError = function () {
  return new CustomError("Your token has expired! Please log in again.", 401);
};

export const globalErrorHandler = function (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  let err = { ...error };

  if (error.name === "TokenExpiredError") {
    err = handleJWTExpiredError();
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  }

  res
    .status(error.statusCode)
    .json({ status: error.status, message: error.message });
};
