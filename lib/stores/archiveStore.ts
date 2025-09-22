import { create } from "zustand";
import { persist } from "zustand/middleware";
import { listPublished } from "@/lib/posts";
import type { Post } from "@/lib/types";

interface ArchiveState {
  posts: Record<string, Post[]>;
  loading: boolean;
  error: string | null;
  fetchPosts: (year: string, language: string) => Promise<void>;
}

export const useArchiveStore = create<ArchiveState>()(
  persist(
    (set, get) => ({
      posts: {},
      loading: false,
      error: null,

      fetchPosts: async (year: string, language: string) => {
        // If posts for current language have already been loaded, return directly
        if (get().posts[`${year}-${language}`]) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const allPosts = listPublished(language as "en" | "zh");
          const posts = allPosts.filter(post => {
            const postYear = post.publishedAt ? new Date(post.publishedAt).getFullYear().toString() : new Date(post.createdAt).getFullYear().toString();
            return postYear === year;
          });
          set((state) => ({
            posts: {
              ...state.posts,
              [`${year}-${language}`]: posts,
            },
            loading: false,
          }));
        } catch (error) {
          console.error("Error fetching archive posts:", error);
          set({
            error: "Failed to load archive posts",
            loading: false,
          });
        }
      },

      // Automatically fetch posts for new language
      switchLanguage: async (year: string, language: string) => {
        if (!get().posts[`${year}-${language}`]) {
          await get().fetchPosts(year, language);
        }
      },
    }),
    {
      name: "archive-storage",
      partialize: (state) => ({ posts: state.posts }),
    }
  )
);
