import { notFound } from "next/navigation";
import { headers } from "next/headers";
import CategoryContent from "./CategoryContent";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  let { category } = resolvedParams;
  const lang = resolvedSearchParams.lang;
  const h = await headers();
  const locale = h.get("x-locale") || "en";
  const language = (lang || locale || "en") as "en" | "zh";

  // Map route parameters to actual category names (case-insensitive)
  const categoryLower = category.toLowerCase();
  if (categoryLower === "buying") {
    category = language === "en" ? "Buying" : "买房";
  } else if (categoryLower === "selling") {
    category = language === "en" ? "Selling" : "卖房";
  }

  try {
    const { getPostsByCategory } = await import("@/lib/posts");
    const posts = await getPostsByCategory(category, language);

    if (!posts || posts.length === 0) {
      notFound();
    }

    return (
      <CategoryContent category={category} posts={posts} language={language} />
    );
  } catch (error) {
    console.error("Failed to get posts:", error);
    notFound();
  }
}
