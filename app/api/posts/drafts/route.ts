import { listDrafts } from "@/lib/posts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  const drafts = listDrafts(lang as "en" | "zh");

  return Response.json(drafts);
}
