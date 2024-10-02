import jsonwebtoken from "jsonwebtoken";

export const signJWTToken = (id: string): string => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
