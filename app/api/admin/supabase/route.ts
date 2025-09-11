import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get("table");
    const action = searchParams.get("action");

    if (!table) {
      return NextResponse.json(
        { error: "Table parameter is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "count":
        const { count, error: countError } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });

        if (countError) throw countError;
        return NextResponse.json({ table, count });

      case "all":
        const { data, error: allError } = await supabase
          .from(table)
          .select("*");

        if (allError) throw allError;
        return NextResponse.json({ table, data });

      case "structure":
        const { data: structureData, error: structureError } = await supabase
          .from("information_schema.columns")
          .select("column_name, data_type, is_nullable")
          .eq("table_name", table);

        if (structureError) throw structureError;
        return NextResponse.json({ table, structure: structureData });

      default:
        const { data: defaultData, error: defaultError } = await supabase
          .from(table)
          .select("*")
          .limit(10);

        if (defaultError) throw defaultError;
        return NextResponse.json({ table, data: defaultData });
    }
  } catch (error) {
    console.error("Supabase query error:", error);
    return NextResponse.json(
      { error: "Failed to query Supabase database" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "SQL query is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("execute_sql", {
      sql_query: query,
    });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Supabase SQL execution error:", error);
    return NextResponse.json(
      { error: "Failed to execute SQL query" },
      { status: 500 }
    );
  }
}
