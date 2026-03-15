"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Plus, Pencil, Trash2, X, Search, Loader2, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface IMusic {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  duration: number;
  coverImageUrl: string;
  lyrics?: string;
  createdAt: string;
}

interface FormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  duration: string;
  coverImageUrl: string;
  lyrics: string;
}

const BASE_URL = "http://localhost:5000/api/music";

const EMPTY_FORM: FormData = {
  title: "",
  artist: "",
  album: "",
  genre: "",
  releaseDate: "",
  duration: "",
  coverImageUrl: "",
  lyrics: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18 }}
        className="
          relative z-10 w-full max-w-lg
          bg-white dark:bg-neutral-950
          border border-neutral-200 dark:border-neutral-800
          rounded-2xl shadow-xl overflow-hidden
        "
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-[14px] font-semibold text-black dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function MusicForm({
  initial,
  onSubmit,
  loading,
}: {
  initial: FormData;
  onSubmit: (data: FormData) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const inputCls = `
    w-full px-3 py-2 rounded-lg text-[13px]
    bg-neutral-50 dark:bg-neutral-900
    border border-neutral-200 dark:border-neutral-800
    text-black dark:text-white
    placeholder:text-neutral-400 dark:placeholder:text-neutral-600
    focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600
    transition-colors
  `;

  const labelCls = "block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Title *</label>
          <input className={inputCls} placeholder="Song title" value={form.title} onChange={set("title")} />
        </div>
        <div>
          <label className={labelCls}>Artist *</label>
          <input className={inputCls} placeholder="Artist name" value={form.artist} onChange={set("artist")} />
        </div>
        <div>
          <label className={labelCls}>Album *</label>
          <input className={inputCls} placeholder="Album name" value={form.album} onChange={set("album")} />
        </div>
        <div>
          <label className={labelCls}>Genre *</label>
          <input className={inputCls} placeholder="e.g. Pop, Jazz" value={form.genre} onChange={set("genre")} />
        </div>
        <div>
          <label className={labelCls}>Release Date *</label>
          <input className={inputCls} type="date" value={form.releaseDate} onChange={set("releaseDate")} />
        </div>
        <div>
          <label className={labelCls}>Duration (seconds) *</label>
          <input className={inputCls} type="number" placeholder="e.g. 214" value={form.duration} onChange={set("duration")} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Cover Image URL *</label>
        <input className={inputCls} placeholder="https://..." value={form.coverImageUrl} onChange={set("coverImageUrl")} />
      </div>
      <div>
        <label className={labelCls}>Lyrics</label>
        <textarea
          className={`${inputCls} resize-none h-20`}
          placeholder="Optional lyrics..."
          value={form.lyrics}
          onChange={set("lyrics")}
        />
      </div>
      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        className="
          w-full mt-1 py-2.5 rounded-lg
          bg-black dark:bg-white
          text-white dark:text-black
          text-[13px] font-medium
          hover:opacity-80 transition-opacity
          disabled:opacity-40 flex items-center justify-center gap-2
        "
      >
        {loading && <Loader2 size={13} className="animate-spin" />}
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ title, onConfirm, onCancel, loading }: { title: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
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

// ─── Main Page ────────────────────────────────────────────────────────────────
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

  // ── Fetch all ──
  const fetchMusic = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BASE_URL);
      const json = await res.json();
      setMusic(json.data || []);
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMusic(); }, []);

  // ── Create ──
  const handleCreate = async (form: FormData) => {
    setMutating(true);
    try {
      await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, duration: Number(form.duration) }),
      });
      setShowCreate(false);
      fetchMusic();
    } finally {
      setMutating(false);
    }
  };

  // ── Update ──
  const handleUpdate = async (form: FormData) => {
    if (!editItem) return;
    setMutating(true);
    try {
      await fetch(`${BASE_URL}/${editItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, duration: Number(form.duration) }),
      });
      setEditItem(null);
      fetchMusic();
    } finally {
      setMutating(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteItem) return;
    setMutating(true);
    try {
      await fetch(`${BASE_URL}/${deleteItem._id}`, { method: "DELETE" });
      setDeleteItem(null);
      fetchMusic();
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

  // ── Edit form default ──
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

      {/* ── Top bar ── */}
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
          {/* Search */}
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

          {/* Add button */}
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

      {/* ── States ── */}
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

      {/* ── Table ── */}
      {!loading && !error && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                  {["Cover", "Title", "Artist", "Album", "Genre", "Duration", "Released", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-neutral-400 dark:text-neutral-600 text-[13px]">
                        No music found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, i) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <img
                            src={item.coverImageUrl}
                            alt={item.title}
                            className="w-9 h-9 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-black dark:text-white max-w-[160px] truncate">{item.title}</td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 max-w-[120px] truncate">{item.artist}</td>
                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 max-w-[120px] truncate">{item.album}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[11px] font-medium">
                            {item.genre}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 tabular-nums">{formatDuration(item.duration)}</td>
                        <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 whitespace-nowrap">{formatDate(item.releaseDate)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => setEditItem(item)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteItem(item)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.length === 0 ? (
              <p className="text-center text-neutral-400 dark:text-neutral-600 text-[13px] py-12">No music found</p>
            ) : (
              filtered.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    border border-neutral-100 dark:border-neutral-800
                    bg-white dark:bg-neutral-950
                  "
                >
                  <img
                    src={item.coverImageUrl}
                    alt={item.title}
                    className="w-11 h-11 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-black dark:text-white truncate">{item.title}</p>
                    <p className="text-[12px] text-neutral-400 dark:text-neutral-500 truncate">{item.artist} · {item.album}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">{item.genre}</span>
                      <span className="text-[11px] text-neutral-400">{formatDuration(item.duration)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => setEditItem(item)} className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteItem(item)} className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>
        {showCreate && (
          <Modal title="Add Music" onClose={() => setShowCreate(false)}>
            <MusicForm initial={EMPTY_FORM} onSubmit={handleCreate} loading={mutating} />
          </Modal>
        )}
        {editItem && (
          <Modal title="Edit Music" onClose={() => setEditItem(null)}>
            <MusicForm initial={editDefault} onSubmit={handleUpdate} loading={mutating} />
          </Modal>
        )}
        {deleteItem && (
          <Modal title="Delete Music" onClose={() => setDeleteItem(null)}>
            <DeleteConfirm
              title={deleteItem.title}
              onConfirm={handleDelete}
              onCancel={() => setDeleteItem(null)}
              loading={mutating}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}