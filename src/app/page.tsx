"use client";

import { motion } from "framer-motion";
import { LogOut, User, Shield, Clock } from "lucide-react";
import { useAuth } from "./context/Auth.context";
import AuthModal from "./components/Auth.modal";
import HomePage from "./pages/Home.page";

export default function Home() {
  const { isAuthenticated, loading, username, logout } = useAuth();

  // While verifying token on first load — show nothing (or a spinner)
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-6 h-6 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white rounded-full"
        />
      </div>
    );
  }

  // Not authenticated — show the login modal
  if (!isAuthenticated) {
    return <AuthModal />;
  }

  // Authenticated — show the real Home page
  return (
    <div className="relative">
      {/* Floating auth badge — top right */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs text-neutral-600 dark:text-neutral-400"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <User className="w-3.5 h-3.5" strokeWidth={1.8} />
        <span className="font-medium text-neutral-900 dark:text-white">{username}</span>
        <button
          onClick={logout}
          className="ml-1 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
      </motion.div>

      <HomePage />
    </div>
  );
}