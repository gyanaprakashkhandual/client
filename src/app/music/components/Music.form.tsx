/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Music,
  User,
  Disc3,
  Tag,
  Calendar,
  Link,
  Clock,
  FileText,
  X,
  Save,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronDown,
  Upload,
  ImageIcon,
  Loader2,
} from "lucide-react";
import type { IMusic } from "@/app/lib/types";

interface MusicFormProps {
  initialData?: IMusic | null;
  onSubmit: (data: Partial<IMusic>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isOpen: boolean;
}

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

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvytvjplt/image/upload";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: "easeOut" } },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 16,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

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

interface CalendarProps {
  value: string;
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
  const [mode, setMode] = useState<"days" | "months">("days");

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
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="absolute z-200 mt-1.5 w-64 rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/10 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800"
    >
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all dark:hover:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "days" ? "months" : "days"))}
          className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-black transition-colors dark:text-zinc-300 dark:hover:text-white"
        >
          {MONTHS[viewMonth]} {viewYear}
          <ChevronDown className="h-2.5 w-2.5 opacity-50" />
        </button>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all dark:hover:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "days" && (
          <motion.div
            key="days"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.13 }}
            className="px-2.5 pb-3"
          >
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="flex h-6 items-center justify-center text-[9px] font-bold uppercase tracking-wider text-gray-400"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
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
                    className={`relative flex h-7 w-full items-center justify-center rounded-lg text-[11px] font-medium transition-all
                      ${
                        isSelected
                          ? "bg-violet-600 text-white"
                          : isToday
                            ? "text-violet-600 font-bold"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                      }`}
                  >
                    {isToday && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0.5 rounded-full bg-violet-600" />
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
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.13 }}
            className="px-2.5 pb-3"
          >
            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setViewMonth(i);
                    setMode("days");
                  }}
                  className={`rounded-xl py-1.5 text-[10px] font-semibold transition-all
                    ${i === viewMonth ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"}`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setViewYear((y) => y - 1)}
                className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-all dark:hover:bg-zinc-800 dark:text-zinc-500"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-300">
                {viewYear}
              </span>
              <button
                type="button"
                onClick={() => setViewYear((y) => y + 1)}
                className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-all dark:hover:bg-zinc-800 dark:text-zinc-500"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-[11px] transition-all
          ${
            open
              ? "border-violet-500/60 ring-1 ring-violet-500/30 bg-white"
              : "border-gray-200 bg-white hover:border-gray-300"
          }
          ${value ? "text-black" : "text-gray-400"} dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-600`}
      >
        <span>{value || placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="text-gray-400"
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute z-200 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-2xl shadow-black/10 overflow-hidden py-1 dark:bg-zinc-900 dark:border-zinc-700"
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt}
                type="button"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02, duration: 0.12 }}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium transition-all
                  ${
                    value === opt
                      ? "text-black bg-gray-100 dark:bg-zinc-800"
                      : "text-gray-600 hover:bg-gray-50 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
              >
                <span>{opt}</span>
                {value === opt && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Check className="h-3 w-3 text-violet-600" />
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
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-[11px] transition-all
          ${
            open
              ? "border-violet-500/60 ring-1 ring-violet-500/30 bg-white"
              : "border-gray-200 bg-white hover:border-gray-300"
          }
          ${value ? "text-black" : "text-gray-400"} dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-600`}
      >
        <span>{display || "Pick a date"}</span>
        <Calendar className="h-3 w-3 text-gray-400" />
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

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

function CoverImageUpload({ value, onChange }: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "test_case_preset");
        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) onChange(data.secure_url);
      } catch (e) {
        console.error(e);
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative w-full h-28 rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all group
        ${
          dragOver
            ? "border-violet-500 bg-violet-50"
            : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
        } dark:border-zinc-700 dark:hover:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-950`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {value && (
        <img
          src={value}
          alt="cover"
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 z-10">
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="h-5 w-5 text-violet-600 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${value ? "bg-white/90 backdrop-blur-sm shadow" : "bg-gray-100 group-hover:bg-gray-200"} dark:bg-zinc-800`}
              >
                {value ? (
                  <ImageIcon className="h-3.5 w-3.5 text-gray-700" />
                ) : (
                  <Upload className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${value ? "text-gray-700" : "text-gray-400 group-hover:text-gray-600"}`}
              >
                {value ? "Change cover" : "Drop or click to upload"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}

function Field({ label, icon, children, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-gray-500">
        <span className="text-gray-400">{icon}</span>
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-500";

function Divider({ label }: { label: string }) {
  return (
    <div className="col-span-2 flex items-center gap-2.5 py-0.5">
      <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
    </div>
  );
}

export default function MusicForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isOpen,
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const set = (key: keyof IMusic, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "white",
              border: "1px solid #e5e5e5",
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            <div
              className="h-px w-full shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #7c3aed, transparent)",
              }}
            />

            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    delay: 0.1,
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-black"
                >
                  {isEdit ? (
                    <Save className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 text-white" />
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.22 }}
                >
                  <h2 className="text-xs font-bold text-black leading-tight dark:text-white">
                    {isEdit ? "Edit Track" : "Add New Track"}
                  </h2>
                  <p className="text-[10px] text-gray-500 mt-0.5 dark:text-zinc-400">
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
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form id="music-form" onSubmit={handleSubmit}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 gap-3"
                >
                  <motion.div variants={itemVariants} className="col-span-2">
                    <Divider label="Track Info" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Field
                      label="Title"
                      icon={<Music className="h-2.5 w-2.5" />}
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
                      icon={<User className="h-2.5 w-2.5" />}
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
                      icon={<Disc3 className="h-2.5 w-2.5" />}
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
                      icon={<Tag className="h-2.5 w-2.5" />}
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

                  <motion.div variants={itemVariants} className="col-span-2">
                    <Divider label="Release & Duration" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Field
                      label="Release Date"
                      icon={<Calendar className="h-2.5 w-2.5" />}
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
                      icon={<Clock className="h-2.5 w-2.5" />}
                      required
                    >
                      <input
                        type="number"
                        min={0}
                        className={inputClass}
                        placeholder="e.g. 210"
                        value={form.duration || ""}
                        onChange={(e) =>
                          set("duration", Number(e.target.value))
                        }
                        required
                      />
                    </Field>
                  </motion.div>

                  <motion.div variants={itemVariants} className="col-span-2">
                    <Divider label="Media" />
                  </motion.div>

                  <motion.div variants={itemVariants} className="col-span-2">
                    <Field
                      label="Cover Image"
                      icon={<ImageIcon className="h-2.5 w-2.5" />}
                      required
                    >
                      <CoverImageUpload
                        value={form.coverImageUrl as string}
                        onChange={(url) => set("coverImageUrl", url)}
                      />
                    </Field>
                  </motion.div>

                  <motion.div variants={itemVariants} className="col-span-2">
                    <Field
                      label="Music URL"
                      icon={<Link className="h-2.5 w-2.5" />}
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

                  <motion.div variants={itemVariants} className="col-span-2">
                    <Field
                      label="Lyrics"
                      icon={<FileText className="h-2.5 w-2.5" />}
                    >
                      <textarea
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Optional lyrics…"
                        value={form.lyrics}
                        onChange={(e) => set("lyrics", e.target.value)}
                      />
                    </Field>
                  </motion.div>
                </motion.div>
              </form>
            </div>

            <div
              className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-gray-100 shrink-0 dark:border-zinc-800"
              style={{ background: "rgba(255,255,255,0.95)" }}
            >
              {onCancel && (
                <motion.button
                  type="button"
                  onClick={onCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-[11px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black transition-all dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  Cancel
                </motion.button>
              )}

              <motion.button
                type="submit"
                form="music-form"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-1.5 overflow-hidden rounded-xl px-4 py-2 text-[11px] font-semibold bg-black text-white disabled:opacity-50 transition-all"
              >
                <motion.span
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/3 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span
                      key="spin"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </motion.span>
                  ) : isEdit ? (
                    <motion.span
                      key="save"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                    >
                      <Save className="h-3.5 w-3.5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="plus"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </motion.span>
                  )}
                </AnimatePresence>

                {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Add Track"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
