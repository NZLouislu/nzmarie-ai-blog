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
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4">
                      <div className="bg-indigo-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-lg font-medium text-indigo-900 mb-1 sm:mb-2">
                          Total Posts
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600">
                          {(analytics.totals.totalPostsEnglish + analytics.totals.totalPostsChinese).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-lg font-medium text-blue-900 mb-1 sm:mb-2">
                          Posts English
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                          {analytics.totals.totalPostsEnglish.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-lg font-medium text-red-900 mb-1 sm:mb-2">
                          Posts Chinese
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
                          {analytics.totals.totalPostsChinese.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                      <div className="bg-green-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-lg font-medium text-green-900 mb-1 sm:mb-2">
                          Total Views
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                          {analytics.totals.totalViews.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-lg font-medium text-pink-900 mb-1 sm:mb-2">
                          Total Likes
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-600">
                          {analytics.totals.totalLikes.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-lg font-medium text-purple-900 mb-1 sm:mb-2">
                          Total Comments
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                          {analytics.totals.totalComments.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-lg font-medium text-yellow-900 mb-1 sm:mb-2">
                          AI Summaries
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">
                          {analytics.totals.totalAiSummaries.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-teal-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm sm:text-lg font-medium text-teal-900 mb-1 sm:mb-2">
                          AI Questions
                        </h3>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-teal-600">
                          {analytics.totals.totalAiQuestions.toLocaleString()}
                        </p>
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
                            Language
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
                          <tr key={`${day.date}-${day.language}`}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {day.language === 'en' ? 'English' : 'Chinese'}
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
                            Language
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
                          <tr key={`${post.postId}-${post.language}`}>
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
                              {post.language === 'en' ? 'English' : 'Chinese'}
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
