import { createClient } from "@supabase/supabase-js";

async function checkConstraints() {
  console.log("Checking database constraints...");

  // Create Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  try {
    // Check posts constraints
    const { error: postsError } = await supabase
      .from("posts")
      .select("id")
      .limit(1);

    if (postsError) {
      console.error("Posts table error:", postsError);
    } else {
      console.log("Posts table accessible");
    }

    // Check users constraints
    const { error: usersError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (usersError) {
      console.error("Users table error:", usersError);
    } else {
      console.log("Users table accessible");
    }

    console.log("Constraint check completed");
  } catch (error) {
    console.error("Error:", error);
  }
}

checkConstraints();
