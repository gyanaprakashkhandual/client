// src/components/music/DeleteConfirm.tsx

import { Loader2, Trash2 } from "lucide-react";

type Props = {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
};

export default function DeleteConfirm({ title, onConfirm, onCancel, loading }: Props) {
  return (
    <div className="text-center space-y-4">
      <div className="w-11 h-11 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center mx-auto">
        <Trash2 size={18} className="text-red-500" />
      </div>
      <div>
        <p className="text-[14px] font-medium text-black dark:text-white">Delete "{title}"?</p>
        <p className="text-[12px] text-neutral-400 dark:text-neutral-500 mt-1">This action cannot be undone.</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[13px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {loading && <Loader2 size={12} className="animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  );
}