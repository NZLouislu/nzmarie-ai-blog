"use client";

import { useState, useEffect } from "react";

interface LoginResult {
  success?: boolean;
  user?: {
    id: string;
    username: string;
    name: string;
    role: string;
  };
  error?: string;
}

interface CookieResult {
  adminAuthenticated?: string;
  [key: string]: string | undefined;
}

export default function DebugAuthPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loginResult, setLoginResult] = useState<LoginResult | null>(null);
  const [cookieResult, setCookieResult] = useState<CookieResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/debug-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoginResult(data);

      // Check cookies after login
      setTimeout(async () => {
        const cookieResponse = await fetch("/api/debug-auth");
        const cookieData = await cookieResponse.json();
        setCookieResult(cookieData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setLoginResult({ error: "Login failed" });
      setIsLoading(false);
    }
  };

  const checkCookies = async () => {
    try {
      const response = await fetch("/api/debug-auth");
      const data = await response.json();
      setCookieResult(data);
    } catch (error) {
      console.error("Cookie check error:", error);
      setCookieResult({ error: "Cookie check failed" });
    }
  };

  // Check cookies on page load
  useEffect(() => {
    checkCookies();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Authentication Debug
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Login Test
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Login Result
            </h2>
            {loginResult ? (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(loginResult, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No login attempt yet</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Cookie Status
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
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Use the default credentials (admin / admin123) to login</li>
            <li>
              After login, check the cookie status to see if adminAuthenticated
              is set
            </li>
            <li>If the cookie is set, try accessing a draft article</li>
            <li>
              If still having issues, check browser developer tools for cookie
              details
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
