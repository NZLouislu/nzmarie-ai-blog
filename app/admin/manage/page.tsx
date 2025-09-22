"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCheck from "./auth-check";
import AdminNavbar from "../../../components/AdminNavbar";
import InitializeBlogData from "../../../components/InitializeBlogData";
import { useAuthStore } from "../../../lib/store/auth";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectUser, selectedUserId } = useAuthStore();

  useEffect(() => {
    const uid = searchParams.get("uid");
    if (uid && uid !== selectedUserId) {
      selectUser(uid);
    }
    setLoading(false);
  }, [searchParams, selectUser, selectedUserId]);

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 w-full bg-gray-200 animate-pulse rounded-lg"
                />
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
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white shadow-sm sm:shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Admin Dashboard
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Welcome to the admin management area
                </p>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <p className="text-gray-600 mb-4">
                  Use the quick links below to navigate to different management sections.
                </p>
              </div>
            </div>

            <InitializeBlogData />

            <div className="bg-white shadow-sm sm:shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Quick Links
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Navigate to management sections
                </p>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <button
                    onClick={() => router.push("/admin/manage/analytics")}
                    className="bg-indigo-50 rounded-lg p-4 text-center hover:bg-indigo-100 transition-colors"
                  >
                    <h3 className="text-sm sm:text-base font-medium text-indigo-900">
                      Analytics
                    </h3>
                    <p className="text-xs sm:text-sm text-indigo-700">
                      View detailed statistics
                    </p>
                  </button>
                  <button
                    onClick={() => router.push("/admin/manage/comments")}
                    className="bg-green-50 rounded-lg p-4 text-center hover:bg-green-100 transition-colors"
                  >
                    <h3 className="text-sm sm:text-base font-medium text-green-900">
                      Comments
                    </h3>
                    <p className="text-xs sm:text-sm text-green-700">
                      Manage comments
                    </p>
                  </button>
                  <button
                    onClick={() => router.push("/admin/manage/toggles")}
                    className="bg-purple-50 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors"
                  >
                    <h3 className="text-sm sm:text-base font-medium text-purple-900">
                      Feature Toggles
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-700">
                      Control features
                    </p>
                  </button>
                  <button
                    onClick={() => router.push("/admin/manage/supabase")}
                    className="bg-yellow-50 rounded-lg p-4 text-center hover:bg-yellow-100 transition-colors"
                  >
                    <h3 className="text-sm sm:text-base font-medium text-yellow-900">
                      Supabase Database
                    </h3>
                    <p className="text-xs sm:text-sm text-yellow-700">
                      View database data
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
