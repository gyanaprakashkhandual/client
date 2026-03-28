"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  trackTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  trackTitle,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                </div>
                <button
                  onClick={onCancel}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mb-1 text-base font-bold text-black dark:text-white">
                Delete Track
              </h3>
              <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-black dark:text-white">
                  &ldquo;{trackTitle}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-50 transition-all"
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}