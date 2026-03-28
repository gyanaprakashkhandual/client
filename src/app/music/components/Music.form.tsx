"use client";

import { useEffect, useRef, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
} from "lucide-react";
import type { IMusic } from "@/app/lib/types";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface MusicFormProps {
  initialData?: IMusic | null;
  onSubmit: (data: Partial<IMusic>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Jazz",
  "Classical",
  "Electronic",
  "R&B",
  "Country",
  "Metal",
  "Indie",
  "Other",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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

// ─────────────────────────────────────────────
// useClickOutside
// ─────────────────────────────────────────────
function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void,
) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

// ─────────────────────────────────────────────
// Custom Calendar
// ─────────────────────────────────────────────
interface CalendarProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (val: string) => void;
  onClose: () => void;
}

function CustomCalendar({ value, onChange, onClose }: CalendarProps) {
  const today = new Date();
  const parsed = value ? new Date(value + "T00:00:00") : null;

  const [viewYear, setViewYear] = useState(
    parsed?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    parsed?.getMonth() ?? today.getMonth(),
  );
  const [mode, setMode] = useState<"days" | "months" | "years">("days");

  const yearBase = Math.floor(viewYear / 12) * 12;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const pad = (n: number) => String(n).padStart(2, "0");
  const selectedStr = parsed
    ? `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`
    : "";

  const select = (day: number) => {
    onChange(`${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`);
    onClose();
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute z-50 mt-2 w-72 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl shadow-black/10 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-all"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "days" ? "months" : "days"))}
          className="flex items-center gap-1 text-sm font-semibold text-black dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
        >
          {MONTHS[viewMonth]} {viewYear}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>

        <button
          type="button"
          onClick={nextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition-all"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "days" && (
          <motion.div
            key="days"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="px-3 pb-4"
          >
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="flex h-8 items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-neutral-400"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const str = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
                const isSelected = str === selectedStr;
                const isToday =
                  day === today.getDate() &&
                  viewMonth === today.getMonth() &&
                  viewYear === today.getFullYear();
                return (
                  <button
                    key={str}
                    type="button"
                    onClick={() => select(day)}
                    className={`
                      relative flex h-8 w-full items-center justify-center rounded-lg text-sm font-medium transition-all
                      ${
                        isSelected
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : isToday
                            ? "text-black dark:text-white font-bold"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }
                    `}
                  >
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-black dark:bg-white" />
                    )}
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {mode === "months" && (
          <motion.div
            key="months"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="px-3 pb-4"
          >
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setViewMonth(i);
                    setMode("days");
                  }}
                  className={`
                    rounded-xl py-2 text-xs font-semibold transition-all
                    ${
                      i === viewMonth
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }
                  `}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
            {/* Year quick nav */}
            <div className="mt-3 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <button
                type="button"
                onClick={() => setViewYear((y) => y - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-all"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-bold text-black dark:text-white">
                {viewYear}
              </span>
              <button
                type="button"
                onClick={() => setViewYear((y) => y + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-all"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Custom Action Menu (Genre Selector)
// ─────────────────────────────────────────────
interface ActionMenuProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}

function ActionMenu({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const select = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all
          ${
            open
              ? "border-black dark:border-white ring-2 ring-black dark:ring-white bg-neutral-50 dark:bg-neutral-800"
              : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500"
          }
          ${value ? "text-black dark:text-white" : "text-neutral-400"}
        `}
      >
        <span>{value || placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="text-neutral-400"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute z-50 mt-1.5 w-full rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl shadow-black/10 overflow-hidden py-1.5"
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt}
                type="button"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025, duration: 0.14 }}
                onClick={() => select(opt)}
                className={`
                  w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all
                  ${
                    value === opt
                      ? "text-black dark:text-white bg-neutral-100 dark:bg-neutral-800"
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-black dark:hover:text-white"
                  }
                `}
              >
                <span>{opt}</span>
                {value === opt && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Check className="h-3.5 w-3.5 text-black dark:text-white" />
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Date Picker Field
// ─────────────────────────────────────────────
interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
}

function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const display = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all
          ${
            open
              ? "border-black dark:border-white ring-2 ring-black dark:ring-white bg-neutral-50 dark:bg-neutral-800"
              : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500"
          }
          ${value ? "text-black dark:text-white" : "text-neutral-400"}
        `}
      >
        <span>{display || "Pick a date"}</span>
        <Calendar className="h-4 w-4 text-neutral-400" />
      </button>

      <AnimatePresence>
        {open && (
          <CustomCalendar
            value={value}
            onChange={onChange}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Field wrapper
// ─────────────────────────────────────────────
interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}

function Field({ label, icon, children, required }: FieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-1.5"
    >
      <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        <span className="text-neutral-400 dark:text-neutral-500">{icon}</span>
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </motion.div>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all";

// ─────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────
function Divider({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2 flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
        {label}
      </span>
      <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Form
// ─────────────────────────────────────────────
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

  // Stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.045, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden"
    >
      {/* ── Top accent bar ── */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-600 to-transparent" />

      <div className="p-6">
        {/* ── Header ── */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                delay: 0.05,
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-black dark:bg-white shadow-md shadow-black/10"
            >
              {isEdit ? (
                <Save className="h-4 w-4 text-white dark:text-black" />
              ) : (
                <Plus className="h-4 w-4 text-white dark:text-black" />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.25 }}
            >
              <h2 className="text-base font-bold text-black dark:text-white leading-tight">
                {isEdit ? "Edit Track" : "Add New Track"}
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isEdit
                  ? "Update the track details below"
                  : "Fill in the track details below"}
              </p>
            </motion.div>
          </div>

          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>

        {/* ── Fields Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {/* Track Info section */}
          <motion.div variants={itemVariants} className="sm:col-span-2">
            <Divider label="Track Info" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Field
              label="Title"
              icon={<Music className="h-3.5 w-3.5" />}
              required
            >
              <input
                className={inputClass}
                placeholder="Track title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </Field>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Field
              label="Artist"
              icon={<User className="h-3.5 w-3.5" />}
              required
            >
              <input
                className={inputClass}
                placeholder="Artist name"
                value={form.artist}
                onChange={(e) => set("artist", e.target.value)}
                required
              />
            </Field>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Field
              label="Album"
              icon={<Disc3 className="h-3.5 w-3.5" />}
              required
            >
              <input
                className={inputClass}
                placeholder="Album name"
                value={form.album}
                onChange={(e) => set("album", e.target.value)}
                required
              />
            </Field>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Field
              label="Genre"
              icon={<Tag className="h-3.5 w-3.5" />}
              required
            >
              <ActionMenu
                value={form.genre as string}
                onChange={(v) => set("genre", v)}
                options={GENRES}
                placeholder="Select genre"
              />
            </Field>
          </motion.div>

          {/* Release & Duration section */}
          <motion.div variants={itemVariants} className="sm:col-span-2">
            <Divider label="Release & Duration" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Field
              label="Release Date"
              icon={<Calendar className="h-3.5 w-3.5" />}
              required
            >
              <DatePicker
                value={form.releaseDate as string}
                onChange={(v) => set("releaseDate", v)}
              />
            </Field>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Field
              label="Duration (seconds)"
              icon={<Clock className="h-3.5 w-3.5" />}
              required
            >
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
          </motion.div>

          {/* Media section */}
          <motion.div variants={itemVariants} className="sm:col-span-2">
            <Divider label="Media" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Field
              label="Music URL"
              icon={<Link className="h-3.5 w-3.5" />}
              required
            >
              <input
                className={inputClass}
                placeholder="https://…"
                value={form.musicUrl}
                onChange={(e) => set("musicUrl", e.target.value)}
                required
              />
            </Field>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Field
              label="Cover Image URL"
              icon={<Image className="h-3.5 w-3.5" />}
              required
            >
              <input
                className={inputClass}
                placeholder="https://…"
                value={form.coverImageUrl}
                onChange={(e) => set("coverImageUrl", e.target.value)}
                required
              />
            </Field>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:col-span-2">
            <Field label="Lyrics" icon={<FileText className="h-3.5 w-3.5" />}>
              <textarea
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Optional lyrics…"
                value={form.lyrics}
                onChange={(e) => set("lyrics", e.target.value)}
              />
            </Field>
          </motion.div>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.25 }}
          className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800 pt-5"
        >
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
            >
              Cancel
            </motion.button>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center gap-2 overflow-hidden rounded-xl bg-black dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-black disabled:opacity-50 transition-all hover:opacity-85"
          >
            {/* Shimmer on hover */}
            <motion.span
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.span
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="block h-4 w-4 rounded-full border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black animate-spin"
                />
              ) : isEdit ? (
                <motion.span
                  key="save"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  <Save className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>

            {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Add Track"}
          </motion.button>
        </motion.div>
      </div>
    </motion.form>
  );
}
