import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/auth/users";
import { withAuth, requireAdmin } from "@/lib/middleware/auth";

export const GET = withAuth(async (req: NextRequest) => {
  if (!requireAdmin(req)) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  try {
    const users = getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
