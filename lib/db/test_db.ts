import { createClient } from "@supabase/supabase-js";

async function testDb() {
  console.log("Testing database connection...");

  // Create Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  try {
    // Test connection by querying a simple table
    const { error } = await supabase.from("posts").select("id").limit(1);

    if (error) {
      console.error("Database connection error:", error);
    } else {
      console.log("Database connection successful");
    }

    console.log("Database test completed");
  } catch (error) {
    console.error("Error:", error);
  }
}

testDb();
