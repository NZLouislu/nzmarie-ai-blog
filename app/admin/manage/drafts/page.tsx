"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../auth-check";
import AdminNavbar from "../../../../components/AdminNavbar";
import { Post } from "@/lib/types";

export default function DraftsManagement() {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        setLoading(true);

        // Fetch drafts from API for both languages
        const [englishResponse, chineseResponse] = await Promise.all([
          fetch("/api/posts/drafts?lang=en"),
          fetch("/api/posts/drafts?lang=zh"),
        ]);

        const englishDrafts = await englishResponse.json();
        const chineseDrafts = await chineseResponse.json();

        // Combine and sort drafts
        const allDrafts = [...englishDrafts, ...chineseDrafts].sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setDrafts(allDrafts);
      } catch (error) {
        console.error("Failed to load drafts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const handleViewPost = (slug: string, language: string) => {
    const path = language === "zh" ? `/cn/blog/${slug}` : `/blog/${slug}`;
    window.open(path, "_blank");
  };

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded"></div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-full bg-gray-200 animate-pulse rounded-lg"
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
          <div className="bg-white shadow-sm sm:shadow rounded-lg">
            <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Drafts Management
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage your draft blog posts
                  </p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {drafts.length} drafts
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 sm:py-6">
              {drafts.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No drafts
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new draft.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Language
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Created
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {drafts.map((draft) => (
                        <tr key={`${draft.id}-${draft.language}`}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {draft.title}
                            <div className="text-gray-500 text-xs mt-1">
                              {draft.excerpt}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                draft.language === "zh"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {draft.language === "zh" ? "Chinese" : "English"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(draft.createdAt).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() =>
                                handleViewPost(
                                  draft.slug,
                                  draft.language || "en"
                                )
                              }
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
}
