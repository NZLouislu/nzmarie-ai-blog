import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Remove unused request parameter
  // export async function GET(request: NextRequest) {
  const adminAuthenticated = request.cookies.get("adminAuthenticated");
  
  return NextResponse.json({
    adminAuthenticated: adminAuthenticated?.value || null,
  });
}