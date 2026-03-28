/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  Music2,
  Heart,
  MessageCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Disc3,
  Mic2,
  LayoutList,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { IMusic } from "@/app/lib/types";

interface MusicFullViewProps {
  tracks: IMusic[];
  onEdit: (track: IMusic) => void;
  onDelete: (track: IMusic) => void;
  isLoading?: boolean;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type SortKey =
  | "title"
  | "artist"
  | "album"
  | "genre"
  | "releaseDate"
  | "duration";

const StatBadge = ({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
}) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${color}`}
    >
      <Icon className="h-4 w-4" />
    </div>
    <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tabular-nums leading-none">
      {value}
    </span>
    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
      {label}
    </span>
  </div>
);

const MetaRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
      <Icon className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
        {label}
      </p>
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug truncate">
        {value}
      </p>
    </div>
  </div>
);

export default function MusicFullView({
  tracks,
  onEdit,
  onDelete,
  isLoading,
}: MusicFullViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [listOpen, setListOpen] = useState(true);

  const sorted = [...tracks].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    const cmp = String(av).localeCompare(String(bv), undefined, {
      numeric: true,
    });
    return sortDir === "asc" ? cmp : -cmp;
  });

  const activeTrack = sorted[activeIndex] ?? null;

  const goTo = (index: number, dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex(index);
  };

  const prev = () => {
    if (activeIndex > 0) goTo(activeIndex - 1, -1);
  };

  const next = () => {
    if (activeIndex < sorted.length - 1) goTo(activeIndex + 1, 1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
      setActiveIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="h-10 w-10 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100"
          />
          <span className="text-xs tracking-widest uppercase text-neutral-400">
            Loading
          </span>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-64 flex-col items-center justify-center gap-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
          <Music2 className="h-6 w-6 text-neutral-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-500">No tracks yet</p>
          <p className="mt-1 text-xs text-neutral-400">
            Add your first track above
          </p>
        </div>
      </motion.div>
    );
  }

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 32, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -32, scale: 0.97 }),
  };

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
          <AnimatePresence mode="wait" custom={direction}>
            {activeTrack && (
              <motion.div
                key={activeTrack._id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="relative overflow-hidden">
                  <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {activeTrack.coverImageUrl ? (
                      <img
                        src={activeTrack.coverImageUrl}
                        alt={activeTrack.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Music2 className="h-16 w-16 text-neutral-300 dark:text-neutral-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-white dark:from-neutral-950 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 mb-1">
                          {activeTrack.genre}
                        </p>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-1">
                          {activeTrack.title}
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {activeTrack.artist}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onEdit(activeTrack)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 shadow-sm transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onDelete(activeTrack)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-neutral-800 border border-rose-200 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 shadow-sm transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-5">
                    <div className="mb-5 flex items-center justify-around border-b border-neutral-100 dark:border-neutral-800 pb-5">
                      <StatBadge
                        icon={Heart}
                        value={activeTrack.likes?.length ?? 0}
                        label="Likes"
                        color="bg-rose-50 dark:bg-rose-950/60 text-rose-500"
                      />
                      <div className="h-10 w-px bg-neutral-100 dark:bg-neutral-800" />
                      <StatBadge
                        icon={MessageCircle}
                        value={activeTrack.comments?.length ?? 0}
                        label="Comments"
                        color="bg-sky-50 dark:bg-sky-950/60 text-sky-500"
                      />
                      <div className="h-10 w-px bg-neutral-100 dark:bg-neutral-800" />
                      <StatBadge
                        icon={Clock}
                        value={activeTrack.duration}
                        label="Seconds"
                        color="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <MetaRow
                        icon={Mic2}
                        label="Artist"
                        value={activeTrack.artist}
                      />
                      <MetaRow
                        icon={Disc3}
                        label="Album"
                        value={activeTrack.album ?? "—"}
                      />
                      <MetaRow
                        icon={Music2}
                        label="Genre"
                        value={activeTrack.genre}
                      />
                      <MetaRow
                        icon={Clock}
                        label="Duration"
                        value={formatDuration(activeTrack.duration)}
                      />
                      <MetaRow
                        icon={Calendar}
                        label="Released"
                        value={formatDate(activeTrack.releaseDate)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 px-5 py-3">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={prev}
              disabled={activeIndex === 0}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <div className="flex items-center gap-1.5">
              {sorted.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                  animate={{
                    width: i === activeIndex ? 20 : 6,
                    backgroundColor: i === activeIndex ? "#737373" : "#e5e5e5",
                  }}
                  transition={{ duration: 0.25 }}
                  className="h-1.5 rounded-full dark:bg-neutral-700"
                  style={{ minWidth: 6 }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={next}
              disabled={activeIndex === sorted.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-72 xl:w-80 shrink-0">
        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
          <button
            onClick={() => setListOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LayoutList className="h-4 w-4 text-neutral-400" />
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                All Tracks
              </span>
              <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                {sorted.length}
              </span>
            </div>
            {listOpen ? (
              <ChevronUp className="h-4 w-4 text-neutral-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {listOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <div className="divide-y divide-neutral-50 dark:divide-neutral-900 max-h-120 overflow-y-auto">
                  {sorted.map((track, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <motion.button
                        key={track._id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, delay: i * 0.02 }}
                        onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                        className={`group w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 ${
                          isActive
                            ? "bg-neutral-50 dark:bg-neutral-900"
                            : "hover:bg-neutral-50/60 dark:hover:bg-neutral-900/60"
                        }`}
                      >
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                          {track.coverImageUrl ? (
                            <img
                              src={track.coverImageUrl}
                              alt={track.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Music2 className="h-3.5 w-3.5 text-neutral-400" />
                            </div>
                          )}
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                              <div className="flex gap-0.5">
                                {[0, 1, 2].map((bar) => (
                                  <motion.div
                                    key={bar}
                                    animate={{ scaleY: [1, 1.8, 0.6, 1.4, 1] }}
                                    transition={{
                                      duration: 0.8,
                                      repeat: Infinity,
                                      delay: bar * 0.15,
                                    }}
                                    className="w-0.5 h-2.5 bg-white rounded-full origin-bottom"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`line-clamp-1 text-xs font-semibold leading-snug ${
                              isActive
                                ? "text-neutral-900 dark:text-neutral-100"
                                : "text-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            {track.title}
                          </p>
                          <p className="line-clamp-1 text-[10px] text-neutral-400 dark:text-neutral-600 mt-0.5">
                            {track.artist}
                          </p>
                        </div>

                        <span className="shrink-0 text-[10px] text-neutral-400 font-mono tabular-nums">
                          {formatDuration(track.duration)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Sort by
                  </span>
                  <div className="flex items-center gap-1">
                    {(["title", "artist", "duration"] as SortKey[]).map(
                      (key) => (
                        <button
                          key={key}
                          onClick={() => toggleSort(key)}
                          className={`rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors capitalize ${
                            sortKey === key
                              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                              : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300"
                          }`}
                        >
                          {key}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
