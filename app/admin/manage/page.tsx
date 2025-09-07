"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCheck from './auth-check';

interface FeatureToggles {
  totalViews: boolean;
  totalLikes: boolean;
  totalComments: boolean;
  aiSummaries: boolean;
  aiQuestions: boolean;
}

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

export default function AdminManagePage() {
  const [toggles, setToggles] = useState<FeatureToggles>({
    totalViews: true,
    totalLikes: true,
    totalComments: true,
    aiSummaries: true,
    aiQuestions: true,
  });
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'toggles' | 'analytics'>('toggles');
  const router = useRouter();

  useEffect(() => {
    // Load current toggles
    loadToggles();
    // Load analytics data
    loadAnalytics();
  }, []);

  const loadToggles = async () => {
    try {
      const response = await fetch('/api/admin/toggles');
      if (response.ok) {
        const data = await response.json();
        setToggles(data);
      }
    } catch (error) {
      console.error('Failed to load toggles:', error);
    }
  };

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

  const updateToggle = async (feature: keyof FeatureToggles, value: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/toggles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feature,
          enabled: value,
        }),
      });

      if (response.ok) {
        setToggles(prev => ({
          ...prev,
          [feature]: value,
        }));
      } else {
        alert('Failed to update toggle');
      }
    } catch (error) {
      console.error('Failed to update toggle:', error);
      alert('Failed to update toggle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">NZLouis Blog Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('toggles')}
                    className={`px-3 py-2 text-sm rounded-md ${
                      activeTab === 'toggles'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Feature Toggles
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-2 text-sm rounded-md ${
                      activeTab === 'analytics'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Analytics
                  </button>
                  <Link
                    href="/admin/manage/comments"
                    className="px-3 py-2 text-sm rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Comments
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {activeTab === 'toggles' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Feature Management</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Control which features are displayed on your blog
                </p>
              </div>

              <div className="px-6 py-6 space-y-6">
                {/* Total Views */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Total Views</h3>
                    <p className="text-sm text-gray-500">Display total view count on blog posts</p>
                  </div>
                  <button
                    onClick={() => updateToggle('totalViews', !toggles.totalViews)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      toggles.totalViews ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        toggles.totalViews ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Total Likes */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Total Likes</h3>
                    <p className="text-sm text-gray-500">Display total like count on blog posts</p>
                  </div>
                  <button
                    onClick={() => updateToggle('totalLikes', !toggles.totalLikes)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      toggles.totalLikes ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        toggles.totalLikes ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Total Comments */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Total Comments</h3>
                    <p className="text-sm text-gray-500">Display total comment count on blog posts</p>
                  </div>
                  <button
                    onClick={() => updateToggle('totalComments', !toggles.totalComments)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      toggles.totalComments ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        toggles.totalComments ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* AI Summaries */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">AI Summaries</h3>
                    <p className="text-sm text-gray-500">Enable AI-generated article summaries</p>
                  </div>
                  <button
                    onClick={() => updateToggle('aiSummaries', !toggles.aiSummaries)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      toggles.aiSummaries ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        toggles.aiSummaries ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* AI Questions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">AI Questions</h3>
                    <p className="text-sm text-gray-500">Enable AI chatbot for article questions</p>
                  </div>
                  <button
                    onClick={() => updateToggle('aiQuestions', !toggles.aiQuestions)}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      toggles.aiQuestions ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        toggles.aiQuestions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Overall Statistics */}
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

              {/* Individual Post Statistics */}
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
                          {analytics.individualStats.map((post, index) => (
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

              {/* Daily Statistics */}
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
                          {analytics.dailyStats.slice(0, 10).map((day, index) => (
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
          )}
        </div>
      </div>
    </AuthCheck>
  );
}
