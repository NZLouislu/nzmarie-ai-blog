"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ForceCookieResult {
  success?: boolean;
  message?: string;
  error?: string;
}

export default function ForceCookiePage() {
  const [result, setResult] = useState<ForceCookieResult | null>(null);
  const router = useRouter();

  const handleForceCookie = async () => {
    try {
      const response = await fetch("/api/force-cookie");
      const data = await response.json();
      setResult(data);
      console.log("Force cookie response:", data);

      // Redirect to test draft article after setting cookie
      setTimeout(() => {
        router.push("/blog/test-draft-article");
      }, 2000);
    } catch (error) {
      console.error("Force cookie error:", error);
      setResult({ error: "Force cookie failed" });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Force Admin Cookie
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-gray-600 mb-4">
            This page will force set the admin cookie and then redirect to the
            test draft article.
          </p>
          <button
            onClick={handleForceCookie}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Force Set Admin Cookie
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
              Click the button to force set admin cookie
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
