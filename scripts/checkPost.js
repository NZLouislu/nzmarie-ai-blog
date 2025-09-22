const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPost() {
  try {
    // Check if the post exists
    const post = await prisma.post.findFirst({
      where: {
        slug: "understanding-body-corporate-apartment-owners-new-zealand",
        language: "en",
      },
    });

    console.log("Post found:", post);

    if (post) {
      // Check if post stats exist
      const stats = await prisma.postStat.findUnique({
        where: {
          post_id_language: {
            post_id: post.id,
            language: "en",
          },
        },
      });

      console.log("Post stats:", stats);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPost();