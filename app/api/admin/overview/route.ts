import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get stats grouped by language from Supabase
    const { data: postStats, error } = await supabase
      .from("post_stats")
      .select("language, views, likes");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch overview" },
        { status: 500 }
      );
    }

    const overview = {
      en: { count: 0, views: 0, likes: 0 },
      zh: { count: 0, views: 0, likes: 0 },
    };

    // Group stats by language
    const statsByLanguage: Record<
      string,
      { count: number; views: number; likes: number }
    > = {
      en: { count: 0, views: 0, likes: 0 },
      zh: { count: 0, views: 0, likes: 0 },
    };

    postStats?.forEach((stat) => {
      const lang = stat.language || "en";
      if (lang in statsByLanguage) {
        statsByLanguage[lang].count += 1;
        statsByLanguage[lang].views += stat.views || 0;
        statsByLanguage[lang].likes += stat.likes || 0;
      }
    });

    overview.en = statsByLanguage.en;
    overview.zh = statsByLanguage.zh;

    return NextResponse.json(overview);
  } catch (error) {
    console.error("Failed to fetch overview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
