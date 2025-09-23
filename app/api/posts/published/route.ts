import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listPublished } from "@/lib/posts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("language") || "en";
    const posts = listPublished(lang as "en" | "zh");
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
