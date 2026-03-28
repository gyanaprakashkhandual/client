"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg text-sm font-medium ${
        toast.type === "success"
          ? "border-emerald-200 dark:border-emerald-800 bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400"
          : "border-rose-200 dark:border-rose-800 bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
      ) : (
        <XCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
      )}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-1 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 min-w-[280px] max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}