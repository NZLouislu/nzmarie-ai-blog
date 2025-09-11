import { create } from "zustand";

interface Comment {
  id: string;
  post_id: string;
  name: string | null;
  email: string | null;
  comment: string;
  is_anonymous: boolean;
  created_at: string;
  language?: string;
}

interface CommentCount {
  id: string;
  post_id: string;
  title: string;
  language: string;
  _count: {
    comments: number;
  };
}

interface CachedComments {
  [key: string]: {
    data: Comment[];
    timestamp: number;
    language: string;
  };
}

interface CommentsState {
  comments: Comment[];
  commentCounts: CommentCount[];
  cachedComments: CachedComments;
  selectedPost: string | null;
  isLoading: boolean;
  isLoadingComments: boolean;
  error: string | null;
  currentLanguage: string;
  lastFetchTime: number;

  setComments: (comments: Comment[]) => void;
  setCommentCounts: (commentCounts: CommentCount[]) => void;
  setCurrentLanguage: (language: string) => void;
  setSelectedPost: (postId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingComments: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCache: () => void;
  invalidateCache: (postId?: string) => void;

  fetchCommentCounts: () => Promise<void>;
  loadCommentsForPost: (
    postId: string,
    forceRefresh?: boolean
  ) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  selectPost: (postId: string) => void;
}

const CACHE_DURATION = 5 * 60 * 1000;
const COMMENT_COUNTS_CACHE_DURATION = 2 * 60 * 1000;

const mockCommentCounts: CommentCount[] = [
  {
    id: "1",
    post_id: "2024-01-10-will-ai-replace-human-developers",
    title: "Will AI Replace Human Developers?",
    language: "en",
    _count: { comments: 3 },
  },
  {
    id: "2",
    post_id: "2024-01-20-new_zealand_paradise_for_children",
    title: "New Zealand: Paradise for Children",
    language: "en",
    _count: { comments: 2 },
  },
];

const mockComments: Comment[] = [
  {
    id: "101",
    post_id: "1",
    name: "John Doe",
    email: "john@example.com",
    comment: "Great article! Very insightful.",
    is_anonymous: false,
    created_at: "2025-09-01T10:30:00Z",
  },
  {
    id: "102",
    post_id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    comment: "Thanks for sharing this perspective!",
    is_anonymous: false,
    created_at: "2025-09-02T11:45:00Z",
  },
];

export const useCommentsStore = create<CommentsState>((set, get) => ({
  comments: [],
  commentCounts: [],
  cachedComments: {},
  selectedPost: null,
  isLoading: false,
  isLoadingComments: false,
  error: null,
  currentLanguage: "en",
  lastFetchTime: 0,

  setComments: (comments) => set({ comments }),
  setCommentCounts: (commentCounts) => set({ commentCounts }),
  setCurrentLanguage: (language) => {
    const { selectedPost, commentCounts } = get();
    set({ currentLanguage: language });

    const filteredPosts = commentCounts.filter(
      (post) => post.language === language
    );
    if (
      filteredPosts.length > 0 &&
      (!selectedPost || !filteredPosts.find((p) => p.post_id === selectedPost))
    ) {
      get().selectPost(filteredPosts[0].post_id);
    }
  },
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingComments: (loading) => set({ isLoadingComments: loading }),
  setError: (error) => set({ error }),

  clearCache: () => set({ cachedComments: {}, lastFetchTime: 0 }),
  invalidateCache: (postId) => {
    const { cachedComments } = get();
    if (postId) {
      const newCache = { ...cachedComments };
      Object.keys(newCache).forEach((key) => {
        if (key.includes(postId)) {
          delete newCache[key];
        }
      });
      set({ cachedComments: newCache });
    } else {
      set({ cachedComments: {} });
    }
  },

  fetchCommentCounts: async () => {
    const { setLoading, setError, setCommentCounts, lastFetchTime } = get();
    const now = Date.now();

    if (now - lastFetchTime < COMMENT_COUNTS_CACHE_DURATION) {
      console.log("Using cached comment counts");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await fetch("/api/admin/init-posts", { method: "POST" });

      const response = await fetch("/api/admin/comments/count");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched comment counts:", data);
        setCommentCounts(data);
        set({ lastFetchTime: now });
      } else {
        console.log("Using mock comment counts");
        setCommentCounts(mockCommentCounts);
      }
    } catch (err) {
      console.error("Failed to load comment counts:", err);
      setError("Failed to load comment counts");
      setCommentCounts(mockCommentCounts);
    } finally {
      setLoading(false);
    }
  },

  loadCommentsForPost: async (postId: string, forceRefresh = false) => {
    const {
      setLoadingComments,
      setError,
      setComments,
      currentLanguage,
      cachedComments,
    } = get();
    const cacheKey = `${postId}-${currentLanguage}`;
    const now = Date.now();

    if (!forceRefresh && cachedComments[cacheKey]) {
      const cached = cachedComments[cacheKey];
      if (now - cached.timestamp < CACHE_DURATION) {
        console.log("Using cached comments for:", postId, currentLanguage);
        setComments(cached.data);
        return;
      }
    }

    console.log(
      "Loading comments for post:",
      postId,
      "language:",
      currentLanguage
    );
    setLoadingComments(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/comments?postId=${postId}&language=${currentLanguage}`
      );
      console.log("Comments API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Comments API response data:", data);
        setComments(data);

        set({
          cachedComments: {
            ...cachedComments,
            [cacheKey]: {
              data,
              timestamp: now,
              language: currentLanguage,
            },
          },
        });
      } else {
        const errorText = await response.text();
        console.error("Comments API error:", errorText);
        console.log("Using mock comments");
        const fallbackComments = mockComments.filter(
          (c) => c.post_id === postId
        );
        setComments(fallbackComments);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError("Failed to load comments");
      const fallbackComments = mockComments.filter((c) => c.post_id === postId);
      setComments(fallbackComments);
    } finally {
      setLoadingComments(false);
    }
  },

  deleteComment: async (id: string) => {
    const {
      selectedPost,
      loadCommentsForPost,
      fetchCommentCounts,
      invalidateCache,
    } = get();
    try {
      const response = await fetch(`/api/admin/comments?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      if (selectedPost) {
        invalidateCache(selectedPost);
        await Promise.all([
          loadCommentsForPost(selectedPost, true),
          fetchCommentCounts(),
        ]);
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      throw err;
    }
  },

  selectPost: (postId: string) => {
    const { setSelectedPost, loadCommentsForPost } = get();
    console.log("Selecting post:", postId);
    setSelectedPost(postId);
    if (postId) {
      loadCommentsForPost(postId);
    }
  },
}));
