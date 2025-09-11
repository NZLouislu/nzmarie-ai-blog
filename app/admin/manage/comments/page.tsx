"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../auth-check";
import AdminNavbar from "../../../../components/AdminNavbar";
import LanguageRadio from "../../../../components/ui/language-radio";
import { useCommentsStore } from "../../../../lib/stores/commentsStore";
import { useToast } from "../../../../components/ui/Toast";

interface CommentCount {
  id: string;
  post_id: string;
  title: string;
  language: string;
  _count: {
    comments: number;
  };
}

export default function CommentsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast, ToastContainer } = useToast();
  const {
    commentCounts,
    comments,
    selectedPost,
    isLoading,
    isLoadingComments,
    error,
    currentLanguage,
    setCurrentLanguage,
    fetchCommentCounts,
    selectPost,
    deleteComment,
    loadCommentsForPost,
    clearCache,
  } = useCommentsStore();

  useEffect(() => {
    fetchCommentCounts();
  }, [fetchCommentCounts]);

  const filteredData = commentCounts.filter(
    (item) =>
      item.language === currentLanguage &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(
    "Filtered data length:",
    filteredData.length,
    "Current language:",
    currentLanguage,
    "Search term:",
    searchTerm
  );

  const handleDeleteComment = async (id: string) => {
    const confirmMessage =
      currentLanguage === "zh"
        ? "确定要删除这条评论吗？"
        : "Are you sure you want to delete this comment?";

    const successMessage =
      currentLanguage === "zh"
        ? "评论删除成功！"
        : "Comment deleted successfully!";

    const errorMessage =
      currentLanguage === "zh"
        ? "删除评论失败，请重试。"
        : "Failed to delete comment. Please try again.";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      console.log("Deleting comment with ID:", id);
      await deleteComment(id);
      console.log("Comment deleted successfully");
      showToast(successMessage, "success");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      showToast(errorMessage, "error");
    }
  };

  const handlePostSelect = (item: CommentCount) => {
    console.log("Handling post selection:", item);
    selectPost(item.post_id);
  };

  useEffect(() => {
    if (commentCounts.length > 0) {
      const filteredPosts = commentCounts.filter(
        (post) => post.language === currentLanguage
      );
      if (filteredPosts.length > 0) {
        if (
          !selectedPost ||
          !filteredPosts.find((p) => p.post_id === selectedPost)
        ) {
          const firstPost = filteredPosts[0];
          console.log(
            "Auto-selecting first post:",
            firstPost.title,
            "Language:",
            currentLanguage
          );
          selectPost(firstPost.post_id);
        }
      } else {
        console.log("No posts found for language:", currentLanguage);
        selectPost("");
      }
    }
  }, [commentCounts, currentLanguage, selectedPost, selectPost]);

  useEffect(() => {
    if (selectedPost) {
      loadCommentsForPost(selectedPost);
    }
  }, [selectedPost, loadCommentsForPost]);

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:shadow rounded-lg">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">
                Comments Management
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                View and manage comments on your blog posts
              </p>
            </div>

            <div className="px-4 sm:px-6 py-4 sm:py-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="flex-1 sm:max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />

                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Language:
                  </label>
                  <LanguageRadio
                    currentLanguage={currentLanguage}
                    onLanguageChange={setCurrentLanguage}
                  />
                </div>

                <button
                  onClick={() => {
                    clearCache();
                    fetchCommentCounts();
                  }}
                  className="px-3 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center justify-center gap-2"
                  title="Refresh data"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[600px]">
                <div className="w-full lg:w-1/3 lg:border-r border-gray-200 lg:pr-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                    Blog Posts
                  </h3>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 w-full bg-gray-200 animate-pulse rounded"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[250px] lg:max-h-[520px] overflow-y-auto">
                      {filteredData.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handlePostSelect(item)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPost === item.post_id
                              ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <h4 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight mb-1">
                            <span className="sm:hidden">
                              {item.title.length > 40
                                ? `${item.title.substring(0, 40)}...`
                                : item.title}
                            </span>
                            <span className="hidden sm:inline">
                              {item.title.length > 60
                                ? `${item.title.substring(0, 60)}...`
                                : item.title}
                            </span>
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="uppercase font-medium">
                              {item.language}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded-full">
                              {item._count.comments}{" "}
                              {item._count.comments === 1
                                ? "comment"
                                : "comments"}
                            </span>
                          </div>
                        </div>
                      ))}
                      {filteredData.length === 0 && (
                        <div className="text-center py-6 sm:py-8 text-gray-500 text-sm">
                          No posts found for the selected language
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 lg:pl-6">
                  {selectedPost ? (
                    <>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                        Comments for Selected Post
                        {isLoadingComments && (
                          <span className="ml-2 text-xs sm:text-sm text-gray-500">
                            Loading...
                          </span>
                        )}
                      </h3>
                      {isLoadingComments ? (
                        <div className="text-center py-6 sm:py-8">
                          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600 mx-auto"></div>
                          <p className="mt-2 text-xs sm:text-sm text-gray-500">
                            Loading comments...
                          </p>
                        </div>
                      ) : comments.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4 max-h-[300px] lg:max-h-[520px] overflow-y-auto">
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900 text-xs sm:text-sm">
                                    {comment.is_anonymous
                                      ? "Anonymous"
                                      : comment.name || "N/A"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      comment.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium transition-colors self-start"
                                >
                                  Delete
                                </button>
                              </div>
                              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                                {comment.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 sm:py-12 text-gray-500">
                          <svg
                            className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <p className="text-xs sm:text-sm">
                            No comments found for this post
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 sm:py-12 text-gray-500">
                      <svg
                        className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <p className="text-xs sm:text-sm">
                        Select a post from the left to view its comments
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </AuthCheck>
  );
}
