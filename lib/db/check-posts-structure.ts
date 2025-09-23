import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function checkPostsStructure() {
  try {
    console.log("Checking posts table structure...");

    // Get a sample post to see all columns
    const { data: samplePost, error: sampleError } = await supabase
      .from("posts")
      .select("*")
      .limit(1);

    if (sampleError) {
      console.error("Error getting sample post:", sampleError);
    } else {
      console.log("Sample post structure:");
      if (samplePost && samplePost.length > 0) {
        Object.keys(samplePost[0]).forEach((key) => {
          console.log(`  - ${key}: ${samplePost[0][key]}`);
        });
      }
    }

    // Check if there's a slug column
    console.log("\nChecking for slug column...");
    const { data: slugCheck, error: slugError } = await supabase
      .from("posts")
      .select("slug")
      .limit(1);

    if (slugError) {
      console.log("No slug column found:", slugError.message);
    } else {
      console.log("Slug column exists");
      if (slugCheck && slugCheck.length > 0) {
        console.log("Sample slug:", slugCheck[0].slug);
      }
    }

    // Check for the specific post with the slug from the error
    console.log(
      '\nChecking for post with slug "navigating-legal-aspects-property-purchase-new-zealand"...'
    );
    const { data: specificPost, error: specificError } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", "navigating-legal-aspects-property-purchase-new-zealand");

    if (specificError) {
      console.error("Error getting specific post:", specificError);
    } else {
      console.log(`Found ${specificPost.length} posts with the specific slug:`);
      if (specificPost.length > 0) {
        console.log(JSON.stringify(specificPost[0], null, 2));
      } else {
        console.log("No posts found with that slug");
      }
    }

    // Check for posts with slugs containing "legal" or "property"
    console.log(
      '\nChecking for posts with slugs containing "legal" or "property"...'
    );
    const { data: legalPropertyPosts, error: legalPropertyError } =
      await supabase
        .from("posts")
        .select("*")
        .or("slug.ilike.%legal%,slug.ilike.%property%");

    if (legalPropertyError) {
      console.error("Error getting legal/property posts:", legalPropertyError);
    } else {
      console.log(
        `Found ${legalPropertyPosts.length} legal/property-related posts:`
      );
      legalPropertyPosts.forEach(
        (post: { id: string; slug: string; title: string }, index: number) => {
          console.log(
            `${index + 1}. ID: ${post.id}, Slug: ${post.slug}, Title: ${
              post.title
            }`
          );
        }
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkPostsStructure();
