"use client";

import { useAuth } from "@/app/context/Auth.context";
import Sidebar from "@/app/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
      {/* Only render Sidebar when the user is authenticated */}
      {!loading && isAuthenticated && <Sidebar />}
      {children}
    </>
  );
}
