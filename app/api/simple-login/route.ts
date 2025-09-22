import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { User } from "@/lib/auth/users";

export async function POST() {
  // Create a mock admin user for testing
  const mockUser: User = {
    id: "test-admin-id",
    username: "admin",
    name: "Test Admin",
    role: "admin" as const,
    languagePreferences: "both",
  };

  const session = createSession(mockUser);

  const response = NextResponse.json({
    success: true,
    user: {
      id: mockUser.id,
      username: mockUser.username,
      name: mockUser.name,
      role: mockUser.role,
    },
    session,
  });

  // Set admin authentication cookie
  response.cookies.set("adminAuthenticated", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export async function GET() {
  // For GET requests, we'll need to access cookies differently
  // This is a simplified version for now
  return NextResponse.json({
    adminAuthenticated: null,
  });
}