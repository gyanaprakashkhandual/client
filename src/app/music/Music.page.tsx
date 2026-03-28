"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Plus, Search, Loader2, AlertCircle } from "lucide-react";

import { IMusic, FormData, EMPTY_FORM } from "./Music.type";
import { fetchAllMusic, createMusic, updateMusic, deleteMusic } from "./Music.api";

import MusicModal from "./Music.modal";
import MusicForm from "./Music.form";
import DeleteConfirm from "./Delete.confirm";
import MusicListDesktop from "./Music.list.desktop";
import MusicListMobile from "./Music.list.mobile";

// ─── Helpers (moved here or to separate file if preferred) ───────────────────
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MusicPage() {
  const [music, setMusic] = useState<IMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mutating, setMutating] = useState(false);

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<IMusic | null>(null);
  const [deleteItem, setDeleteItem] = useState<IMusic | null>(null);

  // ── Fetch ──
  const loadMusic = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllMusic();
      setMusic(data);
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMusic();
  }, []);

  // ── Create ──
  const handleCreate = async (form: FormData) => {
    setMutating(true);
    try {
      await createMusic({ ...form, duration: Number(form.duration) });
      setShowCreate(false);
      loadMusic();
    } finally {
      setMutating(false);
    }
  };

  // ── Update ──
  const handleUpdate = async (form: FormData) => {
    if (!editItem) return;
    setMutating(true);
    try {
      await updateMusic(editItem._id, { ...form, duration: Number(form.duration) });
      setEditItem(null);
      loadMusic();
    } finally {
      setMutating(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteItem) return;
    setMutating(true);
    try {
      await deleteMusic(deleteItem._id);
      setDeleteItem(null);
      loadMusic();
    } finally {
      setMutating(false);
    }
  };

  // ── Filter ──
  const filtered = music.filter((m) =>
    [m.title, m.artist, m.album, m.genre].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  // ── Edit default values ──
  const editDefault: FormData = editItem
    ? {
        title: editItem.title,
        artist: editItem.artist,
        album: editItem.album,
        genre: editItem.genre,
        releaseDate: editItem.releaseDate?.slice(0, 10) ?? "",
        duration: String(editItem.duration),
        coverImageUrl: editItem.coverImageUrl,
        lyrics: editItem.lyrics ?? "",
      }
    : EMPTY_FORM;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 px-4 py-8 md:px-10 md:py-10 ml-60">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2.5">
          <Music size={18} strokeWidth={1.6} className="text-neutral-400 dark:text-neutral-500" />
          <h1 className="text-xl font-semibold tracking-tight text-black dark:text-white">Music</h1>
          {!loading && (
            <span className="ml-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
              {filtered.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="
                pl-8 pr-3 py-2 rounded-lg text-[13px] w-44 sm:w-56
                bg-neutral-50 dark:bg-neutral-900
                border border-neutral-200 dark:border-neutral-800
                text-black dark:text-white
                placeholder:text-neutral-400 dark:placeholder:text-neutral-600
                focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600
                transition-colors
              "
            />
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="
              flex items-center gap-1.5 px-3.5 py-2 rounded-lg
              bg-black dark:bg-white
              text-white dark:text-black
              text-[13px] font-medium
              hover:opacity-80 transition-opacity
            "
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Music</span>
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={20} className="animate-spin text-neutral-300 dark:text-neutral-600" />
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-500 text-[13px]">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* List */}
      {!loading && !error && (
        <>
          <MusicListDesktop items={filtered} onEdit={setEditItem} onDelete={setDeleteItem} />
          <MusicListMobile items={filtered} onEdit={setEditItem} onDelete={setDeleteItem} />
        </>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <MusicModal title="Add Music" onClose={() => setShowCreate(false)}>
            <MusicForm initial={EMPTY_FORM} onSubmit={handleCreate} loading={mutating} />
          </MusicModal>
        )}

        {editItem && (
          <MusicModal title="Edit Music" onClose={() => setEditItem(null)}>
            <MusicForm initial={editDefault} onSubmit={handleUpdate} loading={mutating} />
          </MusicModal>
        )}

        {deleteItem && (
          <MusicModal title="Delete Music" onClose={() => setDeleteItem(null)}>
            <DeleteConfirm
              title={deleteItem.title}
              onConfirm={handleDelete}
              onCancel={() => setDeleteItem(null)}
              loading={mutating}
            />
          </MusicModal>
        )}
      </AnimatePresence>
    </div>
  );
}