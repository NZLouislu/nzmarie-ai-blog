"use client";

import { useState, useEffect } from 'react';
import AuthCheck from '../auth-check';
import AdminNavbar from '../../../../components/AdminNavbar';
import { useCommentsStore } from '../../../../lib/stores/commentsStore';

export default function CommentsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    commentCounts,
    comments,
    selectedPost,
    isLoading,
    error,
    currentLanguage,
    setCurrentLanguage,
    fetchCommentCounts,
    selectPost,
    deleteComment,
    loadCommentsForPost
  } = useCommentsStore();

  useEffect(() => {
    fetchCommentCounts();
  }, [fetchCommentCounts]);

  const filteredData = commentCounts.filter(item =>
    item.language === currentLanguage &&
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered data length:', filteredData.length, 'Current language:', currentLanguage, 'Search term:', searchTerm);

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
    if (commentCounts.length > 0 && !selectedPost) {
      selectPost(commentCounts[0].id);
    }
    console.log('Selected post:', selectedPost, 'Comments length:', comments.length);
  }, [commentCounts, selectedPost, selectPost, comments]);

  useEffect(() => {
    if (selectedPost) {
      loadCommentsForPost(selectedPost);
    }
  }, [currentLanguage, selectedPost, loadCommentsForPost]);

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

              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Language:</label>
                  <div className="relative inline-flex h-6 w-20 items-center rounded-full bg-gray-200 transition-colors">
                    <button
                      type="button"
                      onClick={() => setCurrentLanguage('en')}
                      className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold transition-colors ${
                        currentLanguage === 'en'
                          ? 'shadow-md ring-2 ring-blue-500 ring-inset bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentLanguage('zh')}
                      className={`ml-2 relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold transition-colors ${
                        currentLanguage === 'zh'
                          ? 'shadow-md ring-2 ring-red-500 ring-inset bg-red-600 text-white'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      ZH
                    </button>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 w-full bg-gray-200 animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map(item => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.language.toUpperCase()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item._count.comments}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handlePostSelect(item.id)}
                              className="mr-3 text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete post?')) {
                                  console.log('Delete post', item.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedPost && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Comments for Selected Post</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {comments.length > 0 ? (
                          comments.map((comment) => (
                            <tr key={comment.id}>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {comment.comment.length > 100 ? `${comment.comment.substring(0, 100)}...` : comment.comment}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {comment.is_anonymous ? 'Anonymous' : comment.name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                              No comments found for this post
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}