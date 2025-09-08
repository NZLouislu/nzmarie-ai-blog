"use client";

import { useEffect } from 'react';
import AuthCheck from '../auth-check';
import AdminNavbar from '../../../../components/AdminNavbar';
import { useCommentsStore } from '../../../../lib/stores/commentsStore';

export default function CommentsManagementPage() {
  const {
    comments,
    posts,
    selectedPost,
    isLoading,
    error,
    loadComments,
    loadPosts,
    deleteComment,
    selectPost
  } = useCommentsStore();

  useEffect(() => {
    loadComments();
    loadPosts();
  }, [loadComments, loadPosts]);

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(id);
    } catch {
      alert('Failed to delete comment');
    }
  };

  const handlePostSelect = (postId: string) => {
    selectPost(postId);
  };

  useEffect(() => {
    if (posts.length > 0 && !selectedPost) {
      selectPost(posts[0].id);
    }
  }, [posts, selectedPost, selectPost]);

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Comments Management</h2>
              <p className="mt-1 text-sm text-gray-600">
                View and manage comments on your blog posts
              </p>
            </div>

            <div className="px-6 py-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Blog Posts</h3>
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                      {posts.map((post) => (
                        <li key={post.id}>
                          <button
                            onClick={() => handlePostSelect(post.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                              selectedPost === post.id
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {post.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:w-2/3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3">
                      {selectedPost
                        ? `Comments for: ${posts.find((p) => p.id === selectedPost)?.title || selectedPost}`
                        : 'Select a post to view comments'}
                    </h3>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading comments...</p>
                      </div>
                    ) : selectedPost ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {comments.length > 0 ? (
                              comments.map((comment) => (
                                <tr key={comment.id}>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    {comment.comment.length > 100 ? `${comment.comment.substring(0, 100)}...` : comment.comment}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {comment.is_anonymous ? 'Anonymous' : comment.name || 'N/A'}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={() => handleDeleteComment(comment.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-500">
                                  No comments found for this post
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">Select a blog post from the list to view its comments</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}