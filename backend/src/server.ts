import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log("✅ Connected to SQLite database");

    // Start Express
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
