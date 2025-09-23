import { createClient } from "@supabase/supabase-js";

// 创建 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  try {
    // 查询所有表名
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", [
        "users",
        "posts",
        "post_stats",
        "daily_stats",
        "feature_toggles",
        "comments",
      ]);

    if (tablesError) {
      console.error("Error fetching tables:", tablesError);
      return;
    }

    console.log("Tables in database:");
    tables.forEach((table) => {
      console.log(`- ${table.table_name}`);
    });

    // 查询约束信息
    console.log("\nChecking constraints for each table...");

    for (const table of [
      "users",
      "posts",
      "post_stats",
      "daily_stats",
      "feature_toggles",
      "comments",
    ]) {
      console.log(`\nTable: ${table}`);

      // 查询唯一约束
      const { data: constraints, error: constraintsError } = await supabase
        .from("information_schema.table_constraints")
        .select(
          `
          constraint_name,
          constraint_type
        `
        )
        .eq("table_schema", "public")
        .eq("table_name", table)
        .in("constraint_type", ["UNIQUE", "PRIMARY KEY"]);

      if (constraintsError) {
        console.error(
          `Error fetching constraints for ${table}:`,
          constraintsError
        );
        continue;
      }

      for (const constraint of constraints) {
        console.log(
          `  Constraint: ${constraint.constraint_name} (${constraint.constraint_type})`
        );

        // 查询约束涉及的列
        const { data: columns, error: columnsError } = await supabase
          .from("information_schema.key_column_usage")
          .select("column_name")
          .eq("constraint_name", constraint.constraint_name)
          .eq("table_schema", "public")
          .eq("table_name", table)
          .order("ordinal_position");

        if (columnsError) {
          console.error(
            `Error fetching columns for constraint ${constraint.constraint_name}:`,
            columnsError
          );
          continue;
        }

        console.log(
          `    Columns: ${columns
            .map((col: { column_name: string }) => col.column_name)
            .join(", ")}`
        );
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTableStructure();
