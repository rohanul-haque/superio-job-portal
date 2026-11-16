import prisma from "./prisma";

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

const connectDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      await prisma.$connect();
      isConnected = true;
      console.log("Connected to MongoDB via Prisma ORM successfully.");
    } catch (error) {
      isConnected = false;
      connectionPromise = null;
      console.error("Database connection error:", error);
      throw error;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

export default connectDatabase;
