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

  const dbUser = { ...user.toObject() };
  const responseUser = {
    name: dbUser.name,
    lastName: dbUser.lastName,
    email: dbUser.email,
    accessToken,
  };

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res
    .status(statusCode)
    .json({ status: ResponseStatus.Success, data: responseUser });

  return refreshToken;
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

    const refreshToken = createAndReturnToken(user, 201, res);
    await User.findOneAndUpdate({ _id: user.id }, { refreshToken });
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

    const refreshToken = createAndReturnToken(user, 200, res);
    await User.findOneAndUpdate({ _id: user.id }, { refreshToken });
  } catch (error) {
    res
      .status(401)
      .json({ status: ResponseStatus.Error, message: error.message });
  }
};

export const getUser = async function (req: Request, res: Response) {
  try {
    const jwtUser = jsonwebtoken.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_SECRET as string
    ) as { id: string; iat: number; exp: number };

    const user = await User.findById(jwtUser.id);
    console.log(user);

    const accessToken = jsonwebtoken.sign(
      { id: user!.id },
      process.env.ACCESS_SECRET as string,
      { expiresIn: process.env.ACCESS_EXPIRES_IN }
    );

    const responseUser = {
      name: user?.name,
      lastName: user?.lastName,
      email: user?.email,
      accessToken,
    };
    res
      .status(200)
      .json({ status: ResponseStatus.Success, data: responseUser });
  } catch (error) {
    console.log(error);
  }
};

// TODO: implement LOGOUT (invalidate tokens)
