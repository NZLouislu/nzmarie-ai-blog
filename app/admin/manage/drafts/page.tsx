"use client";

import { useState, useEffect } from "react";
import AuthCheck from "../auth-check";
import AdminNavbar from "../../../../components/AdminNavbar";
import { Post } from "@/lib/types";

export default function DraftsManagement() {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handlePreview = (draft: Post) => {
    setSelectedDraft(draft);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDraft(null);
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
                              onClick={() => handlePreview(draft)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() =>
                                handleViewPost(
                                  draft.slug,
                                  draft.language || "en"
                                )
                              }
                              className="text-green-600 hover:text-green-900"
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

        {/* Preview Modal */}
        {isPreviewOpen && selectedDraft && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Preview: {selectedDraft.title}
                </h3>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto p-6 flex-grow">
                <div className="prose max-w-none">
                  <h1 className="text-3xl font-bold mb-4">
                    {selectedDraft.title}
                  </h1>
                  {selectedDraft.subtitle && (
                    <h2 className="text-xl text-gray-600 mb-4">
                      {selectedDraft.subtitle}
                    </h2>
                  )}
                  <div className="text-sm text-gray-500 mb-6">
                    <span>
                      Created:{" "}
                      {new Date(selectedDraft.createdAt).toLocaleDateString()}
                    </span>
                    <span className="mx-2">•</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedDraft.language === "zh"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedDraft.language === "zh" ? "Chinese" : "English"}
                    </span>
                  </div>
                  {selectedDraft.excerpt && (
                    <p className="text-lg text-gray-700 mb-6 italic">
                      {selectedDraft.excerpt}
                    </p>
                  )}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedDraft.content
                        .replace(/\n/g, "<br />")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/#\s(.*?)\n/g, "<h1>$1</h1>")
                        .replace(/##\s(.*?)\n/g, "<h2>$1</h2>")
                        .replace(/###\s(.*?)\n/g, "<h3>$1</h3>")
                        .replace(
                          /\[(.*?)\]\((.*?)\)/g,
                          '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
                        )
                        .replace(/^- (.*?)(?=\n|$)/gm, "<li>$1</li>")
                        .replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>")
                        .replace(
                          /<ul><li>(.*?)<\/li><\/ul>(\s*<ul><li>.*?<\/li><\/ul>)*/g,
                          (match) =>
                            `<ul>${match.replace(/<\/ul><ul>/g, "")}</ul>`
                        ),
                    }}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closePreview}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}
