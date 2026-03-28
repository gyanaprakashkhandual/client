/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
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
} from "@/app/lib/features/music/music.selector";
import MusicForm from "./components/Music.form";
import MusicListView from "./view/list-view/page";
import DeleteModal from "./components/Delete.modal";
import ToastContainer, { type Toast } from "./components/Toast.container";
import type { IMusic } from "../lib/types";
import Navbar from "./components/Navbar";

export default function MusicPage() {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectAllTracks);
  const loading = useAppSelector(selectMusicLoading);
  const error = useAppSelector(selectMusicError);

  const [showForm, setShowForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState<IMusic | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<IMusic | null>(null);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    dispatch(fetchAllMusic());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addToast("error", error);
      dispatch(clearMusicError());
    }
  }, [error]);

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
    const result = await dispatch(
      updateMusic({ id: editingTrack._id, body: data }),
    );
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
      t.genre.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Header - Now just passes props */}
      <Navbar
        onAddClick={() => {
          setEditingTrack(null);
          setShowForm(true);
        }}
        onRefresh={() => dispatch(fetchAllMusic())}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
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

          <MusicListView
            tracks={filtered}
            onEdit={handleEdit}
            onDelete={setDeletingTrack}
            isLoading={loading && tracks.length === 0}
            onView={function (): void {
              throw new Error("Function not implemented.");
            }}
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

      {/* Music Form as Popup/Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl"
            >
              <MusicForm
                initialData={editingTrack}
                onSubmit={editingTrack ? handleUpdate : handleCreate}
                onCancel={handleCancelForm}
                isLoading={loading}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
