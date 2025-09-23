import { PrismaClient } from "@prisma/client";

async function queryDatabase() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  try {
    // Raw query to check the actual table structure
    console.log("Checking feature_toggles table structure...");
    const tableInfo = await prisma.$queryRaw<
      { column_name: string; data_type: string; is_nullable: string }[]
    >`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'feature_toggles'
      ORDER BY ordinal_position
    `;
    console.log("FeatureToggles table structure:", tableInfo);
  } catch (error) {
    console.error("Database query error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

queryDatabase();
