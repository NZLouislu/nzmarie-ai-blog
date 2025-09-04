export interface Post {
    id: string
    slug: string
    title: string
    excerpt: string
    content: string
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
      slug: "building-modern-blog-nextjs-15",
      title: "Building a Modern Blog with Next.js 15",
      excerpt: "An overview of creating a blog with Next.js 15, Radix UI, and Prisma.",
      content: `# Building a Modern Blog with Next.js 15

Next.js 15 brings exciting new features for building modern web applications. In this comprehensive guide, we'll explore how to create a professional blog using the latest Next.js features.

## Why Next.js 15?

Next.js 15 introduces several improvements:

- **Enhanced Performance**: Better caching and optimization
- **Improved Developer Experience**: Faster builds and hot reloading
- **Advanced Routing**: More flexible routing patterns
- **Built-in Optimizations**: Automatic image and font optimization

## Getting Started

First, let's set up our Next.js project:

\`\`\`bash
npx create-next-app@latest my-blog
cd my-blog
npm install
\`\`\`

## Project Structure

A well-organized project structure is crucial for maintainability:

\`\`\`
my-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── blog/
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── BlogList.tsx
│   └── BlogCard.tsx
└── lib/
    └── posts.ts
\`\`\`

## Key Features

### 1. Dynamic Routing
Next.js 15's app router makes it easy to create dynamic blog posts.

### 2. Image Optimization
Automatic image optimization with the Image component.

### 3. SEO Optimization
Built-in SEO features for better search engine visibility.

## Conclusion

Building a blog with Next.js 15 is straightforward and powerful. The framework handles most optimizations automatically, allowing developers to focus on content creation.`,
      image: "/images/posts/truck.jpg",
      author: {
        name: "Louis Lu",
        avatar: "/images/authors/l.ico",
      },
      date: "2025-08-10",
      readTime: "5 min",
    },
    {
      id: "2",
      slug: "from-hugo-to-nextjs-migration",
      title: "From Hugo to Next.js: Migration Lessons",
      excerpt: "Key lessons learned while migrating a static Hugo blog to Next.js.",
      content: `# From Hugo to Next.js: Migration Lessons

Migrating from Hugo to Next.js was an enlightening experience. This post shares the key lessons and challenges encountered during the transition.

## Why Migrate?

Hugo is excellent for static sites, but Next.js offers:

- **Dynamic Features**: Server-side rendering and API routes
- **Component-Based Architecture**: Better code organization
- **Rich Ecosystem**: Extensive library support
- **Modern Development**: Latest React features

## Migration Challenges

### 1. Content Structure
Hugo uses Markdown with frontmatter, while Next.js requires different data handling.

### 2. Routing Differences
Understanding Next.js routing patterns was crucial.

### 3. Performance Considerations
Ensuring the new site performs as well as the Hugo version.

## Implementation

### Step 1: Data Migration
Convert Hugo content to a format suitable for Next.js.

### Step 2: Component Creation
Build reusable components for blog posts and layouts.

### Step 3: SEO Optimization
Implement proper meta tags and structured data.

## Results

The migration resulted in:
- Faster development cycles
- Better user experience
- Improved performance metrics
- Enhanced scalability

## Conclusion

While challenging, migrating to Next.js was worthwhile. The modern architecture and rich ecosystem provide significant advantages for long-term maintenance.`,
      image: "/images/posts/shark.jpg",
      author: {
        name: "Louis Lu",
        avatar: "/images/authors/l.ico",
      },
      date: "2025-08-12",
      readTime: "4 min",
    },
  ]