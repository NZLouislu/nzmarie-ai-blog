export interface Post {
    id: string
    title: string
    excerpt: string
    image: string
    author: {
      name: string
      avatar: string
    }
    date: string
    readTime: string
  }
  
  export const mockPosts: Post[] = [
    {
      id: "1",
      title: "Building a Modern Blog with Next.js 15",
      excerpt: "An overview of creating a blog with Next.js 15, Radix UI, and Prisma.",
      image: "/images/posts/truck.jpg",
      author: {
        name: "Louis Lu",
        avatar: "/images/authors/l.ico",
      },
      date: "2025-08-10",
      readTime: "2 min",
    },
    {
      id: "2",
      title: "From Hugo to Next.js: Migration Lessons",
      excerpt: "Key lessons learned while migrating a static Hugo blog to Next.js.",
      image: "/images/posts/shark.jpg",
      author: {
        name: "Louis Lu",
        avatar: "/images/authors/l.ico",
      },
      date: "2025-08-12",
      readTime: "3 min",
    },
  ]
  