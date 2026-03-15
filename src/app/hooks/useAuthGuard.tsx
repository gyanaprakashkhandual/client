"use client";

// ─── useAuthGuard ─────────────────────────────────────────────────────────────
// Drop this hook into any page to protect it.
// It returns the auth state; if not authenticated, renders <AuthModal /> instead.
//
// Usage:
//   const { username, logout } = useAuthGuard();
//   if (!username) return null; // AuthModal is already rendered by the hook
// ─────────────────────────────────────────────────────────────────────────────

import { useAuth } from "../context/Auth.context";
import AuthModal from "../components/Auth.modal";
import { motion } from "framer-motion";

export function useAuthGuard() {
  const auth = useAuth();
  return auth;
}

// ─── withAuth HOC ─────────────────────────────────────────────────────────────
// Wrap any page component to auto-guard it:
//   export default withAuth(MyPage);
// ─────────────────────────────────────────────────────────────────────────────

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function GuardedPage(props: P) {
    const { isAuthenticated, loading } = useAuth();

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

    if (!isAuthenticated) return <AuthModal />;

    return <Component {...props} />;
  };
}