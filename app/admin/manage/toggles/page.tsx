"use client";

import { useEffect } from 'react';
import AuthCheck from '../auth-check';
import AdminNavbar from '../../../../components/AdminNavbar';
import { useTogglesStore } from '../../../../lib/stores/togglesStore';

interface FeatureToggles {
  totalViews: boolean;
  totalLikes: boolean;
  totalComments: boolean;
  aiSummaries: boolean;
  aiQuestions: boolean;
}

export default function TogglesPage() {
  const { toggles, isLoading, fetchToggles, updateToggle } = useTogglesStore();

  useEffect(() => {
    fetchToggles();
  }, [fetchToggles]);



  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Feature Management</h2>
              <p className="mt-1 text-sm text-gray-600">
                Control which features are displayed on your blog
              </p>
            </div>

            <div className="px-6 py-6 space-y-6">
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
        </div>
      </div>
    </AuthCheck>
  );
}