"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  username: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = useCallback(() => {
    const authStatus = localStorage.getItem("adminAuthenticated");
    const userData = localStorage.getItem("adminUser");

    if (authStatus === "true" && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return true;
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminUser");
        setUser(null);
        return false;
      }
    }

    setUser(null);
    return false;
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error occurred",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminAuthenticated");
      localStorage.removeItem("adminUser");
      setUser(null);
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    setIsLoading(true);
    checkAuthStatus();
    setIsLoading(false);
  }, [checkAuthStatus]);

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
