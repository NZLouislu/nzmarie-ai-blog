import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PostStats {
  [postId: string]: {
    views: number;
    likes: number;
    comments: number;
    aiQuestions: number;
    aiSummaries: number;
  };
}

interface StatsState {
  postStats: PostStats;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  aiSummaries: number;
  aiQuestions: number;
  setPostStats: (postId: string, stats: Partial<PostStats[string]>) => void;
  incrementViews: (postId: string) => void;
  incrementLikes: (postId: string) => void;
  incrementComments: (postId: string) => void;
  incrementAIStats: (postId: string, type: "questions" | "summaries") => void;
  setTotalStats: (stats: {
    views?: number;
    likes?: number;
    comments?: number;
    aiSummaries?: number;
    aiQuestions?: number;
  }) => void;
  // Helper function to ensure stats data are valid numbers
  ensureValidNumber: (value: unknown) => number;
}

// Helper function to ensure stats data are valid numbers
const ensureValidNumber = (value: unknown): number => {
  const num = Number(value);
  return isNaN(num) || num < 0 ? 0 : num;
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      postStats: {},
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      aiSummaries: 0,
      aiQuestions: 0,

      setPostStats: (postId, stats) =>
        set((state) => ({
          postStats: {
            ...state.postStats,
            [postId]: {
              ...state.postStats[postId],
              ...stats,
            },
          },
        })),

      incrementViews: (postId) =>
        set((state) => ({
          postStats: {
            ...state.postStats,
            [postId]: {
              ...state.postStats[postId],
              views: (state.postStats[postId]?.views || 0) + 1,
            },
          },
          totalViews: state.totalViews + 1,
        })),

      incrementLikes: (postId) =>
        set((state) => ({
          postStats: {
            ...state.postStats,
            [postId]: {
              ...state.postStats[postId],
              likes: (state.postStats[postId]?.likes || 0) + 1,
            },
          },
          totalLikes: state.totalLikes + 1,
        })),

      incrementComments: (postId) =>
        set((state) => ({
          postStats: {
            ...state.postStats,
            [postId]: {
              ...state.postStats[postId],
              comments: (state.postStats[postId]?.comments || 0) + 1,
            },
          },
          totalComments: state.totalComments + 1,
        })),

      incrementAIStats: (postId, type) =>
        set((state) => {
          const statKey = type === "questions" ? "aiQuestions" : "aiSummaries";
          return {
            postStats: {
              ...state.postStats,
              [postId]: {
                ...state.postStats[postId],
                [statKey]: (state.postStats[postId]?.[statKey] || 0) + 1,
              },
            },
            [statKey === "aiQuestions" ? "aiQuestions" : "aiSummaries"]:
              statKey === "aiQuestions"
                ? state.aiQuestions + 1
                : state.aiSummaries + 1,
          };
        }),

      setTotalStats: (stats) =>
        set((state) => ({
          totalViews:
            stats.views !== undefined
              ? ensureValidNumber(stats.views)
              : state.totalViews,
          totalLikes:
            stats.likes !== undefined
              ? ensureValidNumber(stats.likes)
              : state.totalLikes,
          totalComments:
            stats.comments !== undefined
              ? ensureValidNumber(stats.comments)
              : state.totalComments,
          aiSummaries:
            stats.aiSummaries !== undefined
              ? ensureValidNumber(stats.aiSummaries)
              : state.aiSummaries,
          aiQuestions:
            stats.aiQuestions !== undefined
              ? ensureValidNumber(stats.aiQuestions)
              : state.aiQuestions,
        })),

      // Helper function to ensure stats data are valid numbers
      ensureValidNumber: (value: unknown) => {
        const num = Number(value);
        return isNaN(num) || num < 0 ? 0 : num;
      },
    }),
    {
      name: "stats-storage",
      partialize: (state) => ({
        postStats: state.postStats,
        totalViews: state.totalViews,
        totalLikes: state.totalLikes,
        totalComments: state.totalComments,
        aiSummaries: state.aiSummaries,
        aiQuestions: state.aiQuestions,
      }),
    }
  )
);

// Initialize stats store with default values
// Ensure all stats data are valid numbers
export const initializeStatsStore = (
  initialStats?: Record<string, unknown>
) => {
  useStatsStore.getState().setTotalStats({
    views: ensureValidNumber(initialStats?.totalViews),
    likes: ensureValidNumber(initialStats?.totalLikes),
    comments: ensureValidNumber(initialStats?.totalComments),
    aiSummaries: ensureValidNumber(initialStats?.aiSummaries),
    aiQuestions: ensureValidNumber(initialStats?.aiQuestions),
  });
};
