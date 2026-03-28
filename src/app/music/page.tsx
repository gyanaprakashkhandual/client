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
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
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
import MusicForm from "./components/Music.form";
import MusicTable from "./components/Music.table";
import DeleteModal from "./components/Delete.modal";
import ToastContainer, { type Toast } from "./components/Toast.container";
import type { IMusic } from "../lib/types";
import Navbar from "./components/Navbar";

export default function MusicPage() {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectAllTracks);
  const loading = useAppSelector(selectMusicLoading);
  const error = useAppSelector(selectMusicError);
  const total = useAppSelector(selectMusicTotal);

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

  const filtered = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase()) ||
      t.album.toLowerCase().includes(search.toLowerCase()) ||
      t.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Header */}
      <Navbar/>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        {/* Form Panel */}
        <div ref={formRef}>
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="pb-2">
                  <MusicForm
                    initialData={editingTrack}
                    onSubmit={editingTrack ? handleUpdate : handleCreate}
                    onCancel={handleCancelForm}
                    isLoading={loading}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tracks Section */}
        <div>
          {/* Toolbar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              All Tracks
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 py-2 pl-9 pr-4 text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                placeholder="Search tracks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <MusicTable
            tracks={filtered}
            onEdit={handleEdit}
            onDelete={setDeletingTrack}
            isLoading={loading && tracks.length === 0}
          />

          {/* Search no results */}
          {!loading && filtered.length === 0 && tracks.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-sm text-neutral-400"
            >
              No tracks match &ldquo;{search}&rdquo;
            </motion.p>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingTrack)}
        trackTitle={deletingTrack?.title ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTrack(null)}
        isLoading={loading}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}