import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserSession } from "../../../../../lib/auth/session";

const AUTHORIZED_USERS = ["nzmarie", "admin"];

export async function GET() {
  try {
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

    console.log("Draft auth check:", {
      sessionUsername: session.username,
      sessionRole: session.role,
      authorizedUsers: AUTHORIZED_USERS,
      isAuthorized: isAuthorized
    });

    return NextResponse.json({ 
      authorized: isAuthorized,
      user: {
        username: session.username,
        role: session.role
      },
      debug: {
        sessionUsername: session.username,
        authorizedUsers: AUTHORIZED_USERS,
        isAuthorized: isAuthorized
      }
    });

  } catch (error) {
    console.error("Draft auth check error:", error);
    return NextResponse.json({ 
      authorized: false, 
      error: "Authentication check failed" 
    }, { status: 500 });
  }
}