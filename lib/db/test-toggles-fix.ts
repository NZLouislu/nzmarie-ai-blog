import { createClient } from "@supabase/supabase-js";

async function testTogglesFix() {
  console.log("Testing toggles fix...");

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase configuration");
    return;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Test 1: Query user_nzmarie's toggles directly
    console.log("\n--- Test 1: Query user_nzmarie toggles ---");
    const { data: userToggles, error: userTogglesError } = await supabase
      .from("feature_toggles")
      .select("*")
      .eq("user_id", "user_nzmarie")
      .limit(1);

    if (userTogglesError) {
      console.error("User toggles query error:", userTogglesError);
    } else {
      console.log("user_nzmarie toggles:", userToggles);
    }

    // Test 2: Test upsert operation
    console.log("\n--- Test 2: Test upsert operation ---");
    const updateData = {
      user_id: "user_nzmarie",
      total_views: false,
      total_likes: true,
      total_comments: false,
    };

    const { data: upsertResult, error: upsertError } = await supabase
      .from("feature_toggles")
      .upsert(updateData, {
        onConflict: "user_id",
      })
      .select()
      .single();

    if (upsertError) {
      console.error("Upsert error:", upsertError);
    } else {
      console.log("Upsert result:", upsertResult);
    }

    // Test 3: Verify the update
    console.log("\n--- Test 3: Verify update ---");
    const { data: verifyToggles, error: verifyError } = await supabase
      .from("feature_toggles")
      .select("*")
      .eq("user_id", "user_nzmarie")
      .limit(1);

    if (verifyError) {
      console.error("Verify query error:", verifyError);
    } else {
      console.log("Verified toggles:", verifyToggles);
    }
  } catch (error) {
    console.error("Test error:", error);
  }
}

testTogglesFix();
