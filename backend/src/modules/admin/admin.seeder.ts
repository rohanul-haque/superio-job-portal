import config from "../../config";
import prisma from "../../lib/prisma";
import adminService from "./admin.service";

export const runAdminSeeder = async (): Promise<void> => {
  const adminName = config.ADMIN_NAME?.trim() || "Super Admin";
  const adminEmail = config.ADMIN_EMAIL?.trim();
  const adminPassword = config.ADMIN_PASSWORD?.trim();

  // Validate environment variables upfront
  if (!adminEmail || !adminPassword) {
    console.error("Admin seeder failed:");
    console.error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required in environment variables.",
    );
    process.exit(1);
  }

  let exitCode = 0;

  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Database connected successfully.");

    console.log("Creating Admin account...");
    const result = await adminService.seedAdmin({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
    });

    if (result.isNew) {
      console.log("Admin account created successfully.");
      console.log(`Email: ${result.email}`);
    } else {
      console.log("Admin account already exists.");
      console.log("No changes were made.");
      console.log(`Email: ${result.email}`);
    }
  } catch (error) {
    console.error("Admin seeder failed with error:", error);
    exitCode = 1;
  } finally {
    try {
      await prisma.$disconnect();
      console.log("Database connection closed.");
    } catch (disconnectError) {
      console.error("Error closing database connection:", disconnectError);
    }
    process.exit(exitCode);
  }
};

// Execute directly if run as a CLI script
if (require.main === module || process.argv[1]?.includes("admin.seeder")) {
  runAdminSeeder();
}

export default runAdminSeeder;

