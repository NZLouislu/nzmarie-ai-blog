"use client";

import { useEffect } from "react";
import AuthCheck from "../auth-check";
import AdminNavbar from "../../../../components/AdminNavbar";
import { useAnalyticsStore } from "../../../../lib/stores/analyticsStore";

export default function AnalyticsPage() {
  const { analytics, isLoading, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white shadow-sm sm:shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Overall Statistics
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Total metrics across all blog posts
                </p>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {isLoading ? (
                  <div className="text-center py-6 sm:py-8 text-sm">
                    Loading analytics...
                  </div>
                ) : analytics ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4 lg:gap-6">
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                        {analytics.totals.totalViews.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Total Views
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                        {analytics.totals.totalLikes.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Total Likes
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                        {analytics.totals.totalComments.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Total Comments
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                        {analytics.totals.totalPosts.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Total Posts
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-cyan-50 rounded-lg">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-600">
                        {analytics.totals.totalPostsEnglish.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Posts English
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-pink-50 rounded-lg">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600">
                        {analytics.totals.totalPostsChinese.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Posts Chinese
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-indigo-50 rounded-lg">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600">
                        {analytics.totals.totalAiSummaries.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        AI Summaries
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                        {analytics.totals.totalAiQuestions.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        AI Questions
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-sm">
                    Loading analytics...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow-sm sm:shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Daily Statistics
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Daily metrics for the last 30 days
                </p>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {analytics ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Likes
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Comments
                          </th>
                          <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AI Summaries
                          </th>
                          <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AI Questions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.dailyStats.slice(0, 10).map((day) => (
                          <tr key={day.date}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {day.views.toLocaleString()}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {day.likes.toLocaleString()}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {day.comments.toLocaleString()}
                            </td>
                            <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {day.aiSummaries.toLocaleString()}
                            </td>
                            <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {day.aiQuestions.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-sm">
                    Loading daily statistics...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow-sm sm:shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Post Statistics
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Statistics for each individual blog post
                </p>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {analytics ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Post Title
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Likes
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Comments
                          </th>
                          <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AI Summaries
                          </th>
                          <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AI Questions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.individualStats.map((post) => (
                          <tr key={post.postId}>
                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                              <div className="max-w-xs">
                                <span className="sm:hidden truncate block">
                                  {post.title.length > 30
                                    ? `${post.title.substring(0, 30)}...`
                                    : post.title}
                                </span>
                                <span className="hidden sm:block truncate">
                                  {post.title.length > 50
                                    ? `${post.title.substring(0, 50)}...`
                                    : post.title}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {post.views.toLocaleString()}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {post.likes.toLocaleString()}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {post.comments.toLocaleString()}
                            </td>
                            <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {post.aiSummaries.toLocaleString()}
                            </td>
                            <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {post.aiQuestions.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-sm">
                    Loading post statistics...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
