"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  User,
  Disc3,
  Tag,
  Calendar,
  Link,
  Clock,
  Image,
  FileText,
  X,
  Save,
  Plus,
} from "lucide-react";
import type { IMusic } from "@/app/lib/types";

interface MusicFormProps {
  initialData?: IMusic | null;
  onSubmit: (data: Partial<IMusic>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const GENRES = [
  "Pop", "Rock", "Hip-Hop", "Jazz", "Classical",
  "Electronic", "R&B", "Country", "Metal", "Indie", "Other",
];

const emptyForm: Partial<IMusic> = {
  title: "",
  artist: "",
  album: "",
  genre: "",
  releaseDate: "",
  musicUrl: "",
  duration: 0,
  coverImageUrl: "",
  lyrics: "",
};

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}

function Field({ label, icon, children, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        <span className="text-neutral-400 dark:text-neutral-500">{icon}</span>
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all";

export default function MusicForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: MusicFormProps) {
  const [form, setForm] = useState<Partial<IMusic>>(emptyForm);
  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        artist: initialData.artist,
        album: initialData.album,
        genre: initialData.genre,
        releaseDate: initialData.releaseDate?.slice(0, 10) ?? "",
        musicUrl: initialData.musicUrl,
        duration: initialData.duration,
        coverImageUrl: initialData.coverImageUrl,
        lyrics: initialData.lyrics ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const set = (key: keyof IMusic, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black dark:bg-white">
            {isEdit ? (
              <Save className="h-4 w-4 text-white dark:text-black" />
            ) : (
              <Plus className="h-4 w-4 text-white dark:text-black" />
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-black dark:text-white">
              {isEdit ? "Edit Track" : "Add New Track"}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {isEdit ? "Update track details" : "Fill in the track details below"}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title" icon={<Music className="h-3.5 w-3.5" />} required>
          <input
            className={inputClass}
            placeholder="Track title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </Field>

        <Field label="Artist" icon={<User className="h-3.5 w-3.5" />} required>
          <input
            className={inputClass}
            placeholder="Artist name"
            value={form.artist}
            onChange={(e) => set("artist", e.target.value)}
            required
          />
        </Field>

        <Field label="Album" icon={<Disc3 className="h-3.5 w-3.5" />} required>
          <input
            className={inputClass}
            placeholder="Album name"
            value={form.album}
            onChange={(e) => set("album", e.target.value)}
            required
          />
        </Field>

        <Field label="Genre" icon={<Tag className="h-3.5 w-3.5" />} required>
          <select
            className={inputClass}
            value={form.genre}
            onChange={(e) => set("genre", e.target.value)}
            required
          >
            <option value="">Select genre</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Release Date" icon={<Calendar className="h-3.5 w-3.5" />} required>
          <input
            type="date"
            className={inputClass}
            value={form.releaseDate as string}
            onChange={(e) => set("releaseDate", e.target.value)}
            required
          />
        </Field>

        <Field label="Duration (seconds)" icon={<Clock className="h-3.5 w-3.5" />} required>
          <input
            type="number"
            min={0}
            className={inputClass}
            placeholder="e.g. 210"
            value={form.duration || ""}
            onChange={(e) => set("duration", Number(e.target.value))}
            required
          />
        </Field>

        <Field label="Music URL" icon={<Link className="h-3.5 w-3.5" />} required>
          <input
            className={inputClass}
            placeholder="https://..."
            value={form.musicUrl}
            onChange={(e) => set("musicUrl", e.target.value)}
            required
          />
        </Field>

        <Field label="Cover Image URL" icon={<Image className="h-3.5 w-3.5" />} required>
          <input
            className={inputClass}
            placeholder="https://..."
            value={form.coverImageUrl}
            onChange={(e) => set("coverImageUrl", e.target.value)}
            required
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Lyrics" icon={<FileText className="h-3.5 w-3.5" />}>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Optional lyrics..."
              value={form.lyrics}
              onChange={(e) => set("lyrics", e.target.value)}
            />
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
          >
            Cancel
          </button>
        )}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-xl bg-black dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-black disabled:opacity-50 hover:opacity-80 transition-all"
        >
          {isLoading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="block h-4 w-4 rounded-full border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black"
            />
          ) : isEdit ? (
            <Save className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isEdit ? "Save Changes" : "Add Track"}
        </motion.button>
      </div>
    </motion.form>
  );
}