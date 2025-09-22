"use client";

import { useState, useEffect } from "react";

interface CookieResult {
  adminAuthenticated?: string;
  [key: string]: string | undefined;
}

export default function CheckCookiePage() {
  const [cookieResult, setCookieResult] = useState<CookieResult | null>(null);
  const [localStorageResult, setLocalStorageResult] = useState<string | null>(
    null
  );

  const checkCookies = async () => {
    try {
      // Check server-side cookies
      const response = await fetch("/api/check-cookie");
      const data = await response.json();
      setCookieResult(data);

      // Check localStorage
      const adminAuth = localStorage.getItem("adminAuthenticated");
      setLocalStorageResult(adminAuth);
    } catch (error) {
      console.error("Cookie check error:", error);
      setCookieResult({ error: "Cookie check failed" });
    }
  };

  useEffect(() => {
    checkCookies();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Cookie Check</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Server-side Cookies
            </h2>
            <button
              onClick={checkCookies}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Refresh
            </button>
          </div>
          {cookieResult ? (
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(cookieResult, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">Checking cookies...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            LocalStorage Value
          </h2>
          <p className="text-gray-600">
            adminAuthenticated in localStorage:{" "}
            <strong>{localStorageResult || "null"}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
