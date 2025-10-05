import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserSession } from "../../../../lib/auth/session";

const AUTHORIZED_USERS = ["nzmarie", "admin"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const language = searchParams.get("language") || "en";

    if (!slug) {
      return NextResponse.json({ 
        error: "Missing slug parameter" 
      }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("userSession");

    if (!sessionCookie?.value) {
      return NextResponse.json({ 
        authorized: false, 
        error: "No session found" 
      }, { status: 401 });
    }

    const session: UserSession = JSON.parse(sessionCookie.value);
    
    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ 
        authorized: false, 
        error: "Session expired" 
      }, { status: 401 });
    }

    const isAuthorized = AUTHORIZED_USERS.includes(session.username) || 
                        session.role === "admin";

    return NextResponse.json({ 
      authorized: isAuthorized,
      slug: slug,
      language: language,
      user: {
        username: session.username,
        role: session.role
      }
    });

  } catch (error) {
    console.error("Draft review auth check error:", error);
    return NextResponse.json({ 
      authorized: false, 
      error: "Authentication check failed" 
    }, { status: 500 });
  }
}