import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function checkActualConstraints() {
  try {
    console.log("Checking actual constraints in Supabase...");

    // Check for unique constraints on posts table
    const { data: postsConstraints, error: postsError } = await supabase
      .from("information_schema.table_constraints")
      .select("*")
      .eq("table_name", "posts")
      .eq("constraint_type", "UNIQUE");

    if (postsError) {
      console.error("Error fetching posts constraints:", postsError);
    } else {
      console.log("Posts unique constraints:", postsConstraints);
    }

    // Check for unique constraints on users table
    const { data: usersConstraints, error: usersError } = await supabase
      .from("information_schema.table_constraints")
      .select("*")
      .eq("table_name", "users")
      .eq("constraint_type", "UNIQUE");

    if (usersError) {
      console.error("Error fetching users constraints:", usersError);
    } else {
      console.log("Users unique constraints:", usersConstraints);
    }

    // Check for unique constraints on feature_toggles table
    const { data: togglesConstraints, error: togglesError } = await supabase
      .from("information_schema.table_constraints")
      .select("*")
      .eq("table_name", "feature_toggles")
      .eq("constraint_type", "UNIQUE");

    if (togglesError) {
      console.error(
        "Error fetching feature_toggles constraints:",
        togglesError
      );
    } else {
      console.log("Feature toggles unique constraints:", togglesConstraints);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkActualConstraints();
