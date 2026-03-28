
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Music2,
  Plus,
  Search,
  RefreshCw,
  Moon,
  Sun,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { useSidebar } from "@/app/context/Sidebar.context";
import {
  fetchAllMusic,
  createMusic,
  updateMusic,
  deleteMusic,
  clearMusicError,
} from "@/app/lib/features/music/music.slice";
import {
  selectAllTracks,
  selectMusicLoading,
  selectMusicError,
  selectMusicTotal,
} from "@/app/lib/features/music/music.selector";

import type { IMusic } from '@/app/lib/types';



function Navbar() {
      const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectAllTracks);
  const loading = useAppSelector(selectMusicLoading);
  const error = useAppSelector(selectMusicError);
  const total = useAppSelector(selectMusicTotal);
  const { isOpen, toggleSidebar } = useSidebar();

  const [showForm, setShowForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState<IMusic | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<IMusic | null>(null);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchAllMusic());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addToast("error", error);
      dispatch(clearMusicError());
    }
  }, [error]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const addToast = (type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleCreate = async (data: Partial<IMusic>) => {
    const result = await dispatch(createMusic(data));
    if (createMusic.fulfilled.match(result)) {
      addToast("success", "Track added successfully!");
      setShowForm(false);
    }
  };

  const handleUpdate = async (data: Partial<IMusic>) => {
    if (!editingTrack) return;
    const result = await dispatch(updateMusic({ id: editingTrack._id, body: data }));
    if (updateMusic.fulfilled.match(result)) {
      addToast("success", "Track updated successfully!");
      setEditingTrack(null);
      setShowForm(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTrack) return;
    const result = await dispatch(deleteMusic(deletingTrack._id));
    if (deleteMusic.fulfilled.match(result)) {
      addToast("success", `"${deletingTrack.title}" deleted.`);
      setDeletingTrack(null);
    }
  };

  const handleEdit = (track: IMusic) => {
    setEditingTrack(track);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTrack(null);
  };

  return (
    <div>
        {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={toggleSidebar}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              title={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu size={20} strokeWidth={2} />
            </motion.button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black dark:bg-white">
              <Music2 className="h-5 w-5 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none text-black dark:text-white">
                Music Manager
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(fetchAllMusic())}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all"
              title="Refresh"
            >
              <motion.span
                animate={loading ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.span>
            </button>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditingTrack(null);
                setShowForm((v) => !v);
              }}
              className="flex items-center gap-2 rounded-xl bg-black dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black hover:opacity-80 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Track</span>
            </motion.button>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Navbar