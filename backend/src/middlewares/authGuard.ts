import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { IJwtPayload } from "../lib/jwt";
import { verifyAccessToken } from "../lib/jwt";
import prisma from "../lib/prisma";
import type { IAuthAccount, UserRole } from "../modules/auth/auth.interface";
import AUTH_MESSAGES from "../modules/auth/auth.messages";
import AppError from "../utils/AppError";

const authGuard = (...requiredRoles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Read Access Token from HTTP-only cookies or Authorization Bearer header
      const authHeader = req.headers.authorization;
      const bearerToken =
        authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : undefined;
      const token = req.cookies?.accessToken || req.cookies?.token || bearerToken;

      if (!token) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          AUTH_MESSAGES.NO_ACCESS_TOKEN,
        );
      }

      let decoded: IJwtPayload;
      try {
        decoded = verifyAccessToken(token);
      } catch {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          AUTH_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
        );
      }

      const { id, role } = decoded;

      // Check required role
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          `${AUTH_MESSAGES.FORBIDDEN_PREFIX} '${role}'`,
        );
      }

      // Check user existence and status in DB
      let account: IAuthAccount | null = null;

      if (role === "recruiter") {
        account = await prisma.company.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            role: true,
            name: true,
            image: true,
            isEmailVerified: true,
            status: true,
            isDeleted: true,
          },
        });
      } else {
        account = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            role: true,
            name: true,
            profilePicture: true,
            isEmailVerified: true,
            status: true,
            isDeleted: true,
          },
        });
      }

      if (!account) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          AUTH_MESSAGES.USER_PROFILE_NOT_FOUND,
        );
      }

      if (account.isDeleted) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          AUTH_MESSAGES.ACCOUNT_DELETED,
        );
      }

      if (account.status === "blocked") {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          AUTH_MESSAGES.ACCOUNT_BLOCKED,
        );
      }

      if (!account.isEmailVerified) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          AUTH_MESSAGES.EMAIL_NOT_VERIFIED,
        );
      }

      req.user = {
        id: account.id,
        email: account.email,
        role: account.role as UserRole,
        dbUser: account,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authGuard;
