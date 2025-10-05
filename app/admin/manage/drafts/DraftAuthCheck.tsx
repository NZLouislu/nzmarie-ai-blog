"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../../lib/store/auth";

interface DraftAuthCheckProps {
  children: React.ReactNode;
}

export default function DraftAuthCheck({ children }: DraftAuthCheckProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const checkDraftAccess = async () => {
      try {
        setIsLoading(true);

        if (!user) {
          const authStatus = localStorage.getItem("adminAuthenticated");
          const authStorage = localStorage.getItem("auth-storage");
          
          if (!(authStatus === "true" || (authStorage && JSON.parse(authStorage).state?.user))) {
            setIsAuthorized(false);
            return;
          }
        }

        const response = await fetch("/api/posts/drafts/auth-check", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const { authorized } = await response.json();
          setIsAuthorized(authorized);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Draft access check failed:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkDraftAccess();
  }, [user]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-600">
            Verifying draft access permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Draft management is restricted to authorized users only. 
            Only nzmarie and admin users can access draft content.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/admin/home")}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Back to Admin Home
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Login as Different User
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}