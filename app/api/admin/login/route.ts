import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth/validate";
import { createSession } from "@/lib/auth/session";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate credentials
    const user = await validateCredentials(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    const session = createSession(user);

    // Serialize session for cookie storage
    const sessionString = JSON.stringify(session);

    // Set admin-auth cookie
    const adminAuthCookie = serialize("admin-auth", "true", {
      httpOnly: true,
      secure: false, // Set to false in development environment
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "strict",
    });

    // Set userSession cookie
    const userSessionCookie = serialize("userSession", sessionString, {
      httpOnly: true,
      secure: false, // Set to false in development environment
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "strict",
    });

    const response = NextResponse.json({
      success: true,
      session: session,
    });

    response.headers.append("Set-Cookie", adminAuthCookie);
    response.headers.append("Set-Cookie", userSessionCookie);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
