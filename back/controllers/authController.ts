import { Request, Response } from "express";
import User from "../models/user";
import { SignUpBody } from "../types/AuthTypes";
import { ResponseStatus } from "../enums/common";

export const signUp = async function (
  req: Request<{}, {}, SignUpBody>,
  res: Response
) {
  try {
    const user = await User.create({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    res.status(200).json({ status: ResponseStatus.Success, data: user });
  } catch (error) {
    res
      .status(401)
      .json({ status: ResponseStatus.Error, message: error.message });
  }
};
