import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { LoginBody, SignUpBody } from "../types/AuthTypes";
import { ResponseStatus } from "../enums/common";
import { signJWTToken } from "../utils/helpers";

function createAndReturnToken(
  user: Awaited<ReturnType<typeof User.create>>[0],
  statusCode: number,
  res: Response
) {
  const responseUser = { ...user.toObject(), password: undefined };
  const jwt = signJWTToken(user.id);

  res.cookie("jwt", jwt, {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  res
    .status(statusCode)
    .json({ status: ResponseStatus.Success, data: responseUser });
}

export const signUp = async function (
  req: Request<{}, {}, SignUpBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.create({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createAndReturnToken(user, 201, res);
  } catch (error) {
    res
      .status(401)
      .json({ status: ResponseStatus.Error, message: error.message });
  }
};

export const login = async function (
  req: Request<{}, {}, LoginBody>,
  res: Response
) {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: ResponseStatus.Fail,
        message: "Please provide both email and password!",
      });
    }

    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    const isPasswordCorrect =
      user && (await user.isPasswordCorrect(req.body.password, user.password));

    if (!user || !isPasswordCorrect) {
      return res.status(401).json({
        status: ResponseStatus.Fail,
        message: "Incorrect email or password!",
      });
    }

    createAndReturnToken(user, 200, res);
  } catch (error) {
    res
      .status(401)
      .json({ status: ResponseStatus.Error, message: error.message });
  }
};

export const logout = function (req: Request, res: Response) {
  res.cookie("jwt", "", { httpOnly: true });
  res.status(204).json({ status: "success" });
};
