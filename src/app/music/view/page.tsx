"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
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
} from "@/app/lib/features/music/music.selector";
import MusicForm from "../components/Music.form";
import DeleteModal from "../components/Delete.modal";
import ToastContainer, { type Toast } from "../components/Toast.container";
import Navbar from "../components/Navbar";
import type { IMusic } from "@/app/lib/types";
import dynamic from "next/dynamic";

// Dynamic imports for view components
const MusicListView = dynamic(() => import("./list-view/page"), {
  ssr: true,
});
const MusicTileView = dynamic(() => import("./tiles-view/page"), {
  ssr: true,
});
const MusicFullView = dynamic(() => import("./full-view/page"), {
  ssr: true,
});

export default function MusicViewPage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(selectAllTracks);
  const loading = useAppSelector(selectMusicLoading);
  const error = useAppSelector(selectMusicError);

  const [showForm, setShowForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState<IMusic | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<IMusic | null>(null);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Get view type from URL
  const viewParam = searchParams.get("view") || "list-view";

  useEffect(() => {
    dispatch(fetchAllMusic());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addToast("error", error);
      dispatch(clearMusicError());
    }
  }, [error, dispatch]);

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

  const getViewTitle = () => {
    switch (viewParam) {
      case "grid-view":
        return "Grid View";
      case "full-view":
        return "Full View";
      case "list-view":
      default:
        return "List View";
    }
  };

  const renderView = () => {
    switch (viewParam) {
      case "grid-view":
        return (
          <MusicTileView
            tracks={filtered}
            onEdit={handleEdit}
            onDelete={setDeletingTrack}
            onView={() => {}}
            isLoading={loading && tracks.length === 0}
          />
        );
      case "full-view":
        return (
          <MusicFullView
            tracks={filtered}
            onEdit={handleEdit}
            onDelete={setDeletingTrack}
            isLoading={loading && tracks.length === 0}
          />
        );
      case "list-view":
      default:
        return (
          <MusicListView
            tracks={filtered}
            onEdit={handleEdit}
            onDelete={setDeletingTrack}
            onView={() => {}}
            isLoading={loading && tracks.length === 0}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <Navbar
        onAddClick={() => {
          setEditingTrack(null);
          setShowForm(true);
        }}
        onRefresh={() => dispatch(fetchAllMusic())}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
        

        {/* View Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewParam}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-8 w-8 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100"
                  />
                </div>
              }
            >
              {renderView()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <MusicForm
            initialData={editingTrack}
            onSubmit={editingTrack ? handleUpdate : handleCreate}
            onCancel={handleCancelForm}
          />
        )}
        {deletingTrack && (
          <DeleteModal
            track={deletingTrack}
            onConfirm={handleDelete}
            onCancel={() => setDeletingTrack(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}
