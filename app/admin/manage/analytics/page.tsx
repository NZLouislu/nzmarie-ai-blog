"use client";

import { useState, useEffect } from 'react';
import AuthCheck from '../auth-check';
import AdminNavbar from '../../../../components/AdminNavbar';

interface AnalyticsData {
  totals: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalAiQuestions: number;
    totalAiSummaries: number;
  };
  individualStats: Array<{
    postId: string;
    title: string;
    views: number;
    likes: number;
    aiQuestions: number;
    aiSummaries: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    likes: number;
    aiQuestions: number;
    aiSummaries: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Overall Statistics</h2>
                <p className="mt-1 text-sm text-gray-600">Total metrics across all blog posts</p>
              </div>
              <div className="px-6 py-6">
                {analytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analytics.totals.totalViews.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{analytics.totals.totalLikes.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analytics.totals.totalComments.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{analytics.totals.totalAiSummaries.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">AI Summaries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analytics.totals.totalAiQuestions.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">AI Questions</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">Loading analytics...</div>
                )}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Post Statistics</h2>
                <p className="mt-1 text-sm text-gray-600">Statistics for each individual blog post</p>
              </div>
              <div className="px-6 py-6">
                {analytics ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Summaries</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Questions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.individualStats.map((post) => (
                          <tr key={post.postId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.views.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.likes.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.aiSummaries.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.aiQuestions.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">Loading post statistics...</div>
                )}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Daily Statistics</h2>
                <p className="mt-1 text-sm text-gray-600">Daily metrics for the last 30 days</p>
              </div>
              <div className="px-6 py-6">
                {analytics ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Summaries</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Questions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.dailyStats.slice(0, 10).map((day) => (
                          <tr key={day.date}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.views.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.likes.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.aiSummaries.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.aiQuestions.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">Loading daily statistics...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}