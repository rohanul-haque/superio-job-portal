import type { Server } from "http";
import app from "./app";
import config from "./config";
import prisma from "./lib/prisma";

let server: Server;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to MongoDB via Prisma ORM successfully.");

    server = app.listen(config.PORT, () => {
      console.log(
        `🚀 Superio Enterprise Server (v2) is running on port ${config.PORT}`,
      );
      console.log(`📡 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${config.PORT}/api/v1`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database or start server:", error);
    process.exit(1);
  }

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed gracefully");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error("Unexpected error occurred:", error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    if (server) {
      server.close(() => {
        prisma.$disconnect();
        console.log("Process terminated.");
      });
    }
  });
}

bootstrap();
