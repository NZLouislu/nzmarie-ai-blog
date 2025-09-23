import { cookies } from "next/headers";
import { UserSession } from "./session";

// Server-side session validation
export async function validateSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("userSession");

    if (!sessionCookie?.value) return null;

    const session: UserSession = JSON.parse(sessionCookie.value);
    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}
