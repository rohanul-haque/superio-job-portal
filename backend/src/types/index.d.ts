/// <reference types="multer" />

import type { IJwtPayload } from "../lib/jwt";

export interface IDbUser {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  image?: string;
  isEmailVerified?: boolean;
  status?: string;
  isDeleted?: boolean;
  [key: string]: unknown;
}

export interface IGenericErrorMessage {
  path: string | number;
  message: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload & {
        dbUser?: IDbUser | unknown;
      };
    }
  }
}

export {};
