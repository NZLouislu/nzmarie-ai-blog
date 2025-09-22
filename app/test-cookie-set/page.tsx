"use client";

import { useState } from "react";

interface CookieSetResult {
  success?: boolean;
  message?: string;
  error?: string;
}

export default function TestCookieSetPage() {
  const [result, setResult] = useState<CookieSetResult | null>(null);

  const handleSetCookie = async () => {
    try {
      const response = await fetch("/api/test-cookie-set");
      const data = await response.json();
      setResult(data);
      console.log("Cookie set response:", data);

      // Wait a bit and then check cookies
      setTimeout(() => {
        console.log("Document cookies:", document.cookie);
      }, 1000);
    } catch (error) {
      console.error("Cookie set error:", error);
      setResult({ error: "Cookie set failed" });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Test Cookie Set
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={handleSetCookie}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Set Test Cookies
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Result</h2>
          {result ? (
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">
              Click the button to set test cookies
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
