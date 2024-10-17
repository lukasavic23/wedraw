import { NextFunction, Request, Response } from "express";

type ControllerFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | ReturnType<NextFunction>;

export const tryCatch = (controller: ControllerFn) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};
