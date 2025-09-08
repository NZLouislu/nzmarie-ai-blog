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

interface Post {
  id: string;
  title: string;
}

interface CommentsState {
  comments: Comment[];
  posts: Post[];
  selectedPost: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setComments: (comments: Comment[]) => void;
  setPosts: (posts: Post[]) => void;
  setSelectedPost: (postId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Async actions
  loadComments: () => Promise<void>;
  loadPosts: () => Promise<void>;
  loadCommentsForPost: (postId: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  selectPost: (postId: string) => void;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  comments: [],
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,

  setComments: (comments) => set({ comments }),
  setPosts: (posts) => set({ posts }),
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  loadComments: async () => {
    const { setLoading, setError, setComments } = get();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/comments');
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  },

  loadPosts: async () => {
    const { setPosts } = get();
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  },

  loadCommentsForPost: async (postId: string) => {
    const { setLoading, setError, setComments } = get();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/comments?postId=${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  },

  deleteComment: async (id: string) => {
    const { comments, selectedPost, loadCommentsForPost, setComments } = get();

    try {
      const response = await fetch(`/api/admin/comments?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      const updatedComments = comments.filter(comment => comment.id !== id);
      setComments(updatedComments);

      if (selectedPost) {
        loadCommentsForPost(selectedPost);
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