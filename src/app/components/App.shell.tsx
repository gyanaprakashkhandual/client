"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/app/context/Auth.context";
import { useSidebar } from "@/app/context/Sidebar.context";
import Sidebar from "@/app/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {/* Only render Sidebar when the user is authenticated */}
      {!loading && isAuthenticated && (
        <>
          <Sidebar />
          {/* Overlay backdrop */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? "auto" : "none",
            }}
            transition={{ duration: 0.2 }}
            onClick={closeSidebar}
            className="fixed"
          />
        </>
      )}
      <motion.div
        initial={false}
        animate={{
          marginLeft: !loading && isAuthenticated && isOpen ? 240 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
