"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      default:
        return "text-blue-800";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`max-w-md w-full border rounded-lg shadow-lg ${getBackgroundColor()}`}
      >
        <div className="flex items-center p-4">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === "success"
                  ? "text-green-400 hover:text-green-600 focus:ring-green-500"
                  : type === "error"
                  ? "text-red-400 hover:text-red-600 focus:ring-red-500"
                  : "text-blue-400 hover:text-blue-600 focus:ring-blue-500"
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast Provider Hook
export interface ToastState {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
    duration = 3000
  ) => {
    const id = `toast-${++toastCounter}`;
    const newToast: ToastState = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer,
  };
}
