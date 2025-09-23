import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function checkTableStructure() {
  try {
    console.log("Checking table structure...");

    // Check posts table structure
    const { error: postsError } = await supabase
      .from("posts")
      .select("*")
      .limit(0);

    if (postsError) {
      console.error("Posts structure error:", postsError);
    } else {
      console.log("Posts table structure OK");
    }

    // Check users table structure
    const { error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(0);

    if (usersError) {
      console.error("Users structure error:", usersError);
    } else {
      console.log("Users table structure OK");
    }

    console.log("Table structure check completed");
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTableStructure();
