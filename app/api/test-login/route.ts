import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate credentials (test mode always returns true)
    const isValid =
      username === process.env.TEST_ADMIN_USERNAME &&
      password === process.env.TEST_ADMIN_PASSWORD;

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set cookie with secure flag set to false for development environment
    const cookie = serialize("admin-auth", "true", {
      httpOnly: true,
      secure: false, // Set to false in development environment
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "strict",
    });

    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
