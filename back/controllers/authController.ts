import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { JWTToken, LoginBody, SignUpBody } from "../types/AuthTypes";
import { ResponseStatus } from "../enums/common";
import jsonwebtoken, { JsonWebTokenError, VerifyErrors } from "jsonwebtoken";

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

export const refresh = async function (req: Request, res: Response) {
  try {
    const receivedRefreshToken = req.cookies.refreshToken;

    // token doesn't exist
    if (!receivedRefreshToken) {
      return res.status(401).json({
        status: ResponseStatus.Error,
        message: "Not authorized!",
      });
    }

    // verify token expiry
    const verifiedRefreshToken = jsonwebtoken.verify(
      receivedRefreshToken,
      process.env.REFRESH_SECRET as string
    ) as JWTToken;

    const user = await User.findById(verifiedRefreshToken.id);

    if (!user) {
      return res
        .status(403)
        .json({ status: ResponseStatus.Error, message: "User doesn't exist!" });
    }

    if (user.refreshToken !== receivedRefreshToken) {
      return res.status(403).json({
        status: ResponseStatus.Error,
        message: "Session is not verified!",
      });
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

    res
      .status(200)
      .json({ status: ResponseStatus.Success, data: responseUser });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: ResponseStatus.Error,
        message: "You are not authorized!",
      });
    }
  }
};

export const logout = async function (req: Request, res: Response) {
  try {
    const receivedRefreshToken = req.cookies.refreshToken;

    if (!receivedRefreshToken) {
      return res
        .status(204)
        .json({ status: ResponseStatus.Success, data: null });
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
      return res
        .status(204)
        .json({ status: ResponseStatus.Success, data: null });
    }

    await User.findOneAndUpdate({ id: user.id }, { refreshToken: undefined });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(204).json({ status: ResponseStatus.Success, data: null });
  } catch (error) {
    console.log(error, "logout error");
  }
};
