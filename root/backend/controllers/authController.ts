import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { JWTToken, LoginBody, SignUpBody } from "../types/AuthTypes";
import { ResponseStatus } from "../enums/common";
import jsonwebtoken from "jsonwebtoken";
import { tryCatch } from "../utils/tryCatch";
import CustomError from "../utils/CustomError";

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
    sameSite: "none",
    secure: true,
  });

  res
    .status(statusCode)
    .json({ status: ResponseStatus.Success, data: responseUser });

  return refreshToken;
}

export const signUp = tryCatch(async function (
  req: Request<{}, {}, SignUpBody>,
  res: Response,
  _
) {
  const user = await User.create({
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const refreshToken = createAndReturnToken(user, 201, res);
  await User.findOneAndUpdate({ _id: user.id }, { refreshToken });
});

export const login = tryCatch(async function (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) {
  if (!req.body.email || !req.body.password) {
    return next(
      new CustomError("Please provide both email and password!", 400)
    );
  }

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  const isPasswordCorrect =
    user && (await user.isPasswordCorrect(req.body.password, user.password));

  if (!user || !isPasswordCorrect) {
    return next(new CustomError("Incorrect email or password!", 401));
  }

  const refreshToken = createAndReturnToken(user, 200, res);
  await User.findOneAndUpdate({ _id: user.id }, { refreshToken });
});

export const refresh = tryCatch(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const receivedRefreshToken = req.cookies.refreshToken;

  // token doesn't exist
  if (!receivedRefreshToken) {
    return next(new CustomError("You are not authorized!", 401));
  }

  // verify token expiry
  const verifiedRefreshToken = jsonwebtoken.verify(
    receivedRefreshToken,
    process.env.REFRESH_SECRET as string
  ) as JWTToken;

  const user = await User.findById(verifiedRefreshToken.id);

  // user doesn't exist
  if (!user) {
    return next(new CustomError(`User doesn't exists`, 403));
  }

  // received token and DB token do not match
  if (user.refreshToken !== receivedRefreshToken) {
    return next(new CustomError("Session is not verified!", 403));
  }

  const accessToken = jsonwebtoken.sign(
    { id: user.id },
    process.env.ACCESS_SECRET as string,
    { expiresIn: process.env.ACCESS_EXPIRES_IN }
  );

  const responseUser = {
    name: user?.name,
    lastName: user?.lastName,
    email: user?.email,
    accessToken,
  };

  res.status(200).json({ status: ResponseStatus.Success, data: responseUser });
});

export const logout = tryCatch(async function (req: Request, res: Response) {
  const receivedRefreshToken = req.cookies.refreshToken;

  if (!receivedRefreshToken) {
    res.status(204).json({ status: ResponseStatus.Success, data: null });
    return;
  }

  const verifiedRefreshToken = jsonwebtoken.verify(
    receivedRefreshToken,
    process.env.REFRESH_SECRET as string
  ) as JWTToken;

  const user = await User.findById(verifiedRefreshToken.id);
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(204).json({ status: ResponseStatus.Success, data: null });
    return;
  }

  await User.findOneAndUpdate({ id: user.id }, { refreshToken: undefined });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(204).json({ status: ResponseStatus.Success, data: null });
});
