import { create } from 'zustand';

interface Comment {
  id: string;
  post_id: string;
  name: string | null;
  email: string | null;
  comment: string;
  is_anonymous: boolean;
  created_at: string;
}

interface CommentCount {
  id: string;
  title: string;
  language: string;
  _count: {
    comments: number;
  };
}

interface CommentsState {
  comments: Comment[];
  commentCounts: CommentCount[];
  selectedPost: string | null;
  isLoading: boolean;
  error: string | null;
  currentLanguage: string;

  setComments: (comments: Comment[]) => void;
  setCommentCounts: (commentCounts: CommentCount[]) => void;
  setCurrentLanguage: (language: string) => void;
  setSelectedPost: (postId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  fetchCommentCounts: () => Promise<void>;
  loadCommentsForPost: (postId: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  selectPost: (postId: string) => void;
}

// Mock data
const mockCommentCounts: CommentCount[] = [
  {
    id: '1',
    title: 'Will AI Replace Human Developers?',
    language: 'en',
    _count: { comments: 3 }
  },
  {
    id: '2',
    title: 'New Zealand: Paradise for Children',
    language: 'en',
    _count: { comments: 2 }
  }
];

const mockComments: Comment[] = [
  {
    id: '101',
    post_id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    comment: 'Great article! Very insightful.',
    is_anonymous: false,
    created_at: '2025-09-01T10:30:00Z'
  },
  {
    id: '102',
    post_id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    comment: 'Thanks for sharing this perspective!',
    is_anonymous: false,
    created_at: '2025-09-02T11:45:00Z'
  }
];

export const useCommentsStore = create<CommentsState>((set, get) => ({
  comments: [],
  commentCounts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
  currentLanguage: 'en',

  setComments: (comments) => set({ comments }),
  setCommentCounts: (commentCounts) => set({ commentCounts }),
  setCurrentLanguage: (language) => set({ currentLanguage: language }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchCommentCounts: async () => {
    const { setLoading, setError, setCommentCounts } = get();
    setLoading(true);
    setError(null);
    try {
      // Try to fetch real data
      const response = await fetch('/api/admin/comments/count');
      if (response.ok) {
        const data = await response.json();
        setCommentCounts(data);
      } else {
        // Use mock data if API fails
        console.log('Using mock comment counts');
        setCommentCounts(mockCommentCounts);
      }
    } catch (err) {
      console.error('Failed to load comment counts:', err);
      setError('Failed to load comment counts');
      // Use mock data on error
      setCommentCounts(mockCommentCounts);
    } finally {
      setLoading(false);
    }
  },

  loadCommentsForPost: async (postId: string) => {
    const { setLoading, setError, setComments, currentLanguage } = get();
    setLoading(true);
    setError(null);
    try {
      // Try to fetch real data
      const response = await fetch(`/api/admin/comments?postId=${postId}&language=${currentLanguage}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        // Use mock data if API fails
        console.log('Using mock comments');
        setComments(mockComments.filter(c => c.post_id === postId));
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Failed to load comments');
      // Use mock data on error
      setComments(mockComments.filter(c => c.post_id === postId));
    } finally {
      setLoading(false);
    }
  },

  deleteComment: async (id: string) => {
    const { selectedPost, loadCommentsForPost } = get();
    try {
      // Try to delete via API
      const response = await fetch(`/api/admin/comments?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Reload comments after deletion
      if (selectedPost) {
        await loadCommentsForPost(selectedPost);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      throw err;
    }
  },

  selectPost: (postId: string) => {
    const { setSelectedPost, loadCommentsForPost } = get();
    setSelectedPost(postId);
    loadCommentsForPost(postId);
  },
}));