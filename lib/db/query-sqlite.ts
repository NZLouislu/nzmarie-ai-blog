import { createClient } from "@supabase/supabase-js";

async function querySqlite() {
  console.log("Querying SQLite database...");

  // Create Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  try {
    // Query posts
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .limit(5);

    if (postsError) {
      console.error("Posts query error:", postsError);
    } else {
      console.log("Posts:", posts);
    }

    // Query users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(5);

    if (usersError) {
      console.error("Users query error:", usersError);
    } else {
      console.log("Users:", users);
    }

    console.log("SQLite query completed");
  } catch (error) {
    console.error("Error:", error);
  }
}

querySqlite();
