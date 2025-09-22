import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth/validate";
import { createSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  // Remove unused request parameter
  // export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = validateCredentials(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const session = createSession(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      session,
    });

    // Set admin authentication cookie if user is admin
    if (user.role === "admin") {
      response.cookies.set("adminAuthenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("Debug auth API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Remove unused request parameter
  // export async function GET(request: NextRequest) {
  const adminAuthenticated = request.cookies.get("adminAuthenticated");
  
  return NextResponse.json({
    adminAuthenticated: adminAuthenticated?.value || null,
  });
}