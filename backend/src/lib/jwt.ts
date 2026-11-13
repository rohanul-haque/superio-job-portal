import type { Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import config from "../config";

export interface IJwtPayload {
  id: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";
}

export interface IEmailVerificationPayload {
  id: string;
  email: string;
  role: "candidate" | "recruiter";
  purpose: "email-verification";
}

export const signAccessToken = (payload: IJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.JWT_ACCESS_SECRET as Secret, options);
};

export const signRefreshToken = (payload: IJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.JWT_REFRESH_SECRET as Secret, options);
};

export const signEmailVerificationToken = (
  payload: IEmailVerificationPayload,
): string => {
  const options: SignOptions = {
    expiresIn:
      (config.JWT_EMAIL_VERIFICATION_EXPIRES_IN as SignOptions["expiresIn"]) ||
      "5m",
  };
  return jwt.sign(
    payload,
    config.JWT_EMAIL_VERIFICATION_SECRET as Secret,
    options,
  );
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET as Secret) as IJwtPayload;
};

export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET as Secret) as IJwtPayload;
};

export const verifyEmailVerificationToken = (
  token: string,
): IEmailVerificationPayload => {
  return jwt.verify(
    token,
    config.JWT_EMAIL_VERIFICATION_SECRET as Secret,
  ) as IEmailVerificationPayload;
};
