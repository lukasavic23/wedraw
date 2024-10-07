import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { LoginBody, SignUpBody } from "../types/AuthTypes";
import { ResponseStatus } from "../enums/common";
import jsonwebtoken from "jsonwebtoken";

function createAndReturnToken(
  user: Awaited<ReturnType<typeof User.create>>[0],
  statusCode: number,
  res: Response
) {
  const accessToken = jsonwebtoken.sign(
    { id: user.id },
    process.env.ACCESS_SECRET as string,
    { expiresIn: process.env.ACCESS_EXPIRES_IN }
  );
  const refreshToken = jsonwebtoken.sign(
    { id: user.id },
    process.env.REFRESH_SECRET as string,
    { expiresIn: process.env.REFRESH_EXPIRES_IN }
  );

  const responseUser = {
    ...user.toObject(),
    password: undefined,
    refreshToken: undefined,
    accessToken,
  };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
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

// TODO: implement LOGOUT (invalidate tokens)
