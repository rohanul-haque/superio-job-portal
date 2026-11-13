import { PrismaClient } from "@prisma/client";
import config from "../config";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      config.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (config.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
