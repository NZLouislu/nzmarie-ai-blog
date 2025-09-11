import { create } from "zustand";

interface AnalyticsData {
  totals: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalAiQuestions: number;
    totalAiSummaries: number;
    totalPosts: number;
    totalPostsEnglish: number;
    totalPostsChinese: number;
  };
  individualStats: Array<{
    postId: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    aiQuestions: number;
    aiSummaries: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    likes: number;
    comments: number;
    aiQuestions: number;
    aiSummaries: number;
  }>;
}

interface AnalyticsState {
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;

  fetchAnalytics: () => Promise<void>;
  setAnalytics: (data: AnalyticsData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  analytics: null,
  isLoading: false,
  error: null,

  setAnalytics: (analytics) => set({ analytics }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchAnalytics: async () => {
    const { setLoading, setError, setAnalytics } = get();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  },
}));
