"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../manage/auth-check";
import AdminNavbar from "../../../components/AdminNavbar";
import { useStatsStore } from "../../../lib/stores/statsStore";

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const { totalViews, totalLikes, totalComments, aiSummaries, aiQuestions } = useStatsStore();

  useEffect(() => {
    // Simple loading state
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">Loading...</div>
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
            <p className="mt-2 text-gray-600">Overview of blog statistics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Views</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-red-600">{totalLikes.toLocaleString()}</div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Likes</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-green-600">{totalComments.toLocaleString()}</div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Comments</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-purple-600">{aiSummaries.toLocaleString()}</div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">AI Summaries</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-indigo-600">{aiQuestions.toLocaleString()}</div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">AI Questions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
