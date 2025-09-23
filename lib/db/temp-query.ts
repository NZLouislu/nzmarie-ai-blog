import { createClient } from "@supabase/supabase-js";

async function tempQuery() {
  console.log("Running temporary query...");

  // Create Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  try {
    // Temporary query for testing
    const { data, error } = await supabase.from("posts").select("*").limit(1);

    if (error) {
      console.error("Query error:", error);
    } else {
      console.log("Query result:", data);
    }

    console.log("Temporary query completed");
  } catch (error) {
    console.error("Error:", error);
  }
}

tempQuery();
