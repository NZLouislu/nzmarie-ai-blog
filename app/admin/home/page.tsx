"use client";

import { useState, useEffect } from 'react';
import AuthCheck from '../manage/auth-check';
import AdminNavbar from '../../../components/AdminNavbar';
import { useStatsStore } from '../../../lib/stores/statsStore';

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const { fetchStats, enStats, zhStats, totalStats, fetchTotalStats } = useStatsStore();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const enPromise = fetchStats('en', 'all');
        const zhPromise = fetchStats('zh', 'all');
        const totalPromise = fetchTotalStats();
        await Promise.all([enPromise, zhPromise, totalPromise]);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [fetchStats, fetchTotalStats]);

  const getStats = (language: 'en' | 'zh') => {
    return language === 'en' ? enStats : zhStats;
  };

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 w-full bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Welcome to NZLouis blog admin panel</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Overall Statistics</h2>
                <p className="mt-1 text-sm text-gray-600">Total blog statistics across all languages</p>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-green-900 mb-2">Total Views</h3>
                    <p className="text-3xl font-bold text-green-600">{totalStats.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">Total Likes</h3>
                    <p className="text-3xl font-bold text-blue-600">{totalStats.totalLikes.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-purple-900 mb-2">Total Comments</h3>
                    <p className="text-3xl font-bold text-purple-600">{totalStats.totalComments.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-orange-900 mb-2">AI Questions</h3>
                    <p className="text-3xl font-bold text-orange-600">{totalStats.totalAiQuestions.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Language Statistics</h2>
                <p className="mt-1 text-sm text-gray-600">Blog statistics by language</p>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">English Blogs</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Number of Posts</span>
                        <span className="font-semibold">{getStats('en').posts?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Total Views</span>
                        <span className="font-semibold">{getStats('en').totalViews?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Total Likes</span>
                        <span className="font-semibold">{getStats('en').totalLikes?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-red-900 mb-2">Chinese Blogs</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-red-700">Number of Posts</span>
                        <span className="font-semibold">{getStats('zh').posts?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-red-700">Total Views</span>
                        <span className="font-semibold">{getStats('zh').totalViews?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-red-700">Total Likes</span>
                        <span className="font-semibold">{getStats('zh').totalLikes?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Management Sections</h2>
                <p className="mt-1 text-sm text-gray-600">Navigate to different management areas</p>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a href="/admin/manage/analytics" className="bg-indigo-50 rounded-lg p-4 text-center hover:bg-indigo-100 transition-colors">
                    <h3 className="font-medium text-indigo-900">Analytics</h3>
                    <p className="text-sm text-indigo-700">View detailed statistics</p>
                  </a>
                  <a href="/admin/manage/comments" className="bg-green-50 rounded-lg p-4 text-center hover:bg-green-100 transition-colors">
                    <h3 className="font-medium text-green-900">Comments</h3>
                    <p className="text-sm text-green-700">Manage comments</p>
                  </a>
                  <a href="/admin/manage/toggles" className="bg-purple-50 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors">
                    <h3 className="font-medium text-purple-900">Feature Toggles</h3>
                    <p className="text-sm text-purple-700">Control features</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}