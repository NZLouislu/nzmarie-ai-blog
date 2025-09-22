"use client";

import { useState } from "react";

export default function InitializeBlogData() {
  const [loading, setLoading] = useState<{
    chinese: boolean;
    english: boolean;
  }>({
    chinese: false,
    english: false,
  });

  const handleInitializeChinese = async () => {
    setLoading((prev) => ({ ...prev, chinese: true }));
    try {
      const response = await fetch("/api/admin/init-chinese-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: "zh" }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `Successfully initialized Chinese blog data!\n\nProcessed: ${
            result.results.length
          } posts\nCreated: ${
            result.results.filter(
              (r: { status: string }) => r.status === "created"
            ).length
          }\nAlready existed: ${
            result.results.filter(
              (r: { status: string }) => r.status === "exists"
            ).length
          }`
        );
        // Refresh the page to show updated stats
        window.location.reload();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Failed to initialize: ${error}`);
    } finally {
      setLoading((prev) => ({ ...prev, chinese: false }));
    }
  };

  const handleInitializeEnglish = async () => {
    setLoading((prev) => ({ ...prev, english: true }));
    try {
      const response = await fetch("/api/admin/init-english-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: "en" }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `Successfully initialized English blog data!\n\nProcessed: ${
            result.results.length
          } posts\nCreated: ${
            result.results.filter(
              (r: { status: string }) => r.status === "created"
            ).length
          }\nAlready existed: ${
            result.results.filter(
              (r: { status: string }) => r.status === "exists"
            ).length
          }`
        );
        // Refresh the page to show updated stats
        window.location.reload();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Failed to initialize: ${error}`);
    } finally {
      setLoading((prev) => ({ ...prev, english: false }));
    }
  };

  return (
    <div className="bg-white shadow-sm sm:shadow rounded-lg">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-medium text-gray-900">
          Initialize Blog Data
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">
          Create statistics data for all blog posts in the database
        </p>
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will scan the{" "}
            <code className="bg-gray-100 px-1 rounded">lib/post</code> directory
            and create statistics data for all blog posts in the database.
            It&apos;s safe to run multiple times - existing data won&apos;t be
            overwritten.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleInitializeChinese}
              disabled={loading.chinese}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.chinese ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Initializing...
                </>
              ) : (
                "Initialize Chinese Data"
              )}
            </button>
            <button
              onClick={handleInitializeEnglish}
              disabled={loading.english}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.english ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Initializing...
                </>
              ) : (
                "Initialize English Data"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
