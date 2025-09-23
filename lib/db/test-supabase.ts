import { createClient } from "@supabase/supabase-js";

async function testSupabase() {
  console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
  console.log(
    "SUPABASE_SERVICE_ROLE_KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "***" : "NOT SET"
  );

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase configuration");
    return;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Test connection by querying users
    console.log("\n--- Testing Users Table ---");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .ilike("id", "%nzmarie%");

    if (usersError) {
      console.error("Users query error:", usersError);
    } else {
      console.log("Users found:", users);
    }

    // Test feature_toggles table
    console.log("\n--- Testing Feature Toggles Table ---");
    const { data: toggles, error: togglesError } = await supabase
      .from("feature_toggles")
      .select("*")
      .limit(5);

    if (togglesError) {
      console.error("Feature toggles query error:", togglesError);
    } else {
      console.log("Feature toggles:", toggles);
    }

    // Check table structure using a different approach
    console.log("\n--- Checking Table Structure ---");
    const { data: tableInfo, error: tableInfoError } = await supabase.rpc(
      "get_columns_info",
      { table_name: "feature_toggles" }
    );

    if (tableInfoError) {
      console.log("Could not get table info via RPC, trying direct query...");

      // Try to get column info directly
      const { data: columns, error: columnsError } = await supabase
        .from("information_schema.columns")
        .select("column_name, data_type, is_nullable")
        .eq("table_schema", "public")
        .eq("table_name", "feature_toggles")
        .order("ordinal_position");

      if (columnsError) {
        console.error("Columns query error:", columnsError);
      } else {
        console.log("Feature toggles table structure:");
        columns.forEach(
          (col: {
            column_name: string;
            data_type: string;
            is_nullable: string;
          }) => {
            console.log(
              `  ${col.column_name} (${col.data_type}, ${col.is_nullable})`
            );
          }
        );
      }
    } else {
      console.log("Table info:", tableInfo);
    }

    // Test querying specific user's toggles
    console.log("\n--- Testing User-Specific Toggles ---");
    if (users && users.length > 0) {
      for (const user of users) {
        console.log(`\nQuerying toggles for user: ${user.id}`);

        const { data: userToggles, error: userTogglesError } = await supabase
          .from("feature_toggles")
          .select("*")
          .eq("user_id", user.id)
          .limit(1);

        if (userTogglesError) {
          console.error("User toggles query error:", userTogglesError);
        } else {
          console.log("User toggles:", userToggles);
        }
      }
    }

    // Test querying all user_nzmarie related data
    console.log("\n--- Testing user_nzmarie Specific Data ---");
    const { data: nzmarieToggles, error: nzmarieError } = await supabase
      .from("feature_toggles")
      .select("*")
      .eq("user_id", "user_nzmarie")
      .limit(1);

    if (nzmarieError) {
      console.error("user_nzmarie toggles query error:", nzmarieError);
    } else {
      console.log("user_nzmarie toggles:", nzmarieToggles);
    }
  } catch (error) {
    console.error("Test error:", error);
  }
}

testSupabase();
