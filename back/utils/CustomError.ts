import { ResponseStatus } from "../enums/common";

class CustomError extends Error {
  public statusCode;
  public status;
  public isOperational;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4")
      ? ResponseStatus.Fail
      : ResponseStatus.Error;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
