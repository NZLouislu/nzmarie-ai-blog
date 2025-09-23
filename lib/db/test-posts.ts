import { createClient } from "@supabase/supabase-js";

async function testPosts() {
  console.log("Testing posts functionality...");

  // Create Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  try {
    // Test posts query
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug")
      .limit(3);

    if (error) {
      console.error("Posts query error:", error);
    } else {
      console.log("Posts test result:", data);
    }

    console.log("Posts test completed");
  } catch (error) {
    console.error("Error:", error);
  }
}

testPosts();
