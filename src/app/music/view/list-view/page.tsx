"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  Music2,
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Clock,
  Eye,
} from "lucide-react";
import type { IMusic } from "@/app/lib/types";

interface MusicListViewProps {
  tracks: IMusic[];
  onEdit: (track: IMusic) => void;
  onDelete: (track: IMusic) => void;
  onView: (track: IMusic) => void;
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
    month: "short",
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

export default function MusicListView({
  tracks,
  onEdit,
  onDelete,
  onView,
  isLoading,
}: MusicListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...tracks].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    const cmp = String(av).localeCompare(String(bv), undefined, {
      numeric: true,
    });
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) => (
    <motion.span
      animate={{ opacity: sortKey === col ? 1 : 0.25 }}
      transition={{ duration: 0.15 }}
    >
      {sortDir === "asc" || sortKey !== col ? (
        <ChevronUp className="h-3 w-3" />
      ) : (
        <ChevronDown className="h-3 w-3" />
      )}
    </motion.span>
  );

  const ThBtn = ({
    col,
    children,
  }: {
    col: SortKey;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => toggleSort(col)}
      className="group/th flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150"
    >
      {children}
      <SortIcon col={col} />
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100"
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

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800/80">
              <th className="px-5 py-4 text-left w-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  #
                </span>
              </th>
              <th className="px-3 py-4 text-left">
                <ThBtn col="title">Title</ThBtn>
              </th>
              <th className="px-3 py-4 text-left">
                <ThBtn col="artist">Artist</ThBtn>
              </th>
              <th className="hidden px-3 py-4 text-left md:table-cell">
                <ThBtn col="album">Album</ThBtn>
              </th>
              <th className="hidden px-3 py-4 text-left lg:table-cell">
                <ThBtn col="genre">Genre</ThBtn>
              </th>
              <th className="hidden px-3 py-4 text-left xl:table-cell">
                <ThBtn col="releaseDate">Date</ThBtn>
              </th>
              <th className="hidden px-3 py-4 text-left sm:table-cell">
                <ThBtn col="duration">
                  <Clock className="h-3 w-3" />
                </ThBtn>
              </th>
              <th className="hidden px-3 py-4 lg:table-cell">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  Stats
                </span>
              </th>
              <th className="px-5 py-4 text-right">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {sorted.map((track, i) => (
                <motion.tr
                  key={track._id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18, delay: i * 0.015 }}
                  onMouseEnter={() => setHoveredId(track._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative border-b border-neutral-100 dark:border-neutral-800/80 last:border-0 transition-colors duration-100 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/80"
                >
                  <td className="px-5 py-3.5 text-center">
                    <motion.span
                      animate={{
                        opacity: hoveredId === track._id ? 0 : 1,
                        scale: hoveredId === track._id ? 0.7 : 1,
                      }}
                      transition={{ duration: 0.15 }}
                      className="text-xs text-neutral-300 dark:text-neutral-600 font-mono tabular-nums absolute"
                      style={{ width: 20 }}
                    >
                      {i + 1}
                    </motion.span>
                    <motion.span
                      animate={{
                        opacity: hoveredId === track._id ? 1 : 0,
                        scale: hoveredId === track._id ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.15 }}
                      className="text-neutral-400"
                    >
                      <Music2 className="h-3.5 w-3.5" />
                    </motion.span>
                  </td>

                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-sm">
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
                            <Music2 className="h-4 w-4 text-neutral-400" />
                          </div>
                        )}
                        <motion.div
                          animate={{ opacity: hoveredId === track._id ? 1 : 0 }}
                          transition={{ duration: 0.15 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl"
                        >
                          <div className="flex gap-0.5">
                            {[0, 1, 2].map((bar) => (
                              <motion.div
                                key={bar}
                                animate={
                                  hoveredId === track._id
                                    ? { scaleY: [1, 1.8, 0.6, 1.4, 1] }
                                    : { scaleY: 1 }
                                }
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: bar * 0.15,
                                }}
                                className="w-0.5 h-3 bg-white rounded-full origin-bottom"
                              />
                            ))}
                          </div>
                        </motion.div>
                      </div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 max-w-[160px] text-sm">
                        {track.title}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3.5">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {track.artist}
                    </span>
                  </td>

                  <td className="hidden px-3 py-3.5 md:table-cell max-w-[140px]">
                    <span className="line-clamp-1 text-sm text-neutral-500 dark:text-neutral-500">
                      {track.album}
                    </span>
                  </td>

                  <td className="hidden px-3 py-3.5 lg:table-cell">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 tracking-wide">
                      {track.genre}
                    </span>
                  </td>

                  <td className="hidden px-3 py-3.5 xl:table-cell">
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">
                      {formatDate(track.releaseDate)}
                    </span>
                  </td>

                  <td className="hidden px-3 py-3.5 sm:table-cell">
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums font-mono">
                      {formatDuration(track.duration)}
                    </span>
                  </td>

                  <td className="hidden px-3 py-3.5 lg:table-cell">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Heart className="h-3 w-3 text-rose-400" />
                        <span className="tabular-nums">
                          {track.likes?.length ?? 0}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-neutral-400">
                        <MessageCircle className="h-3 w-3 text-sky-400" />
                        <span className="tabular-nums">
                          {track.comments?.length ?? 0}
                        </span>
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-0.5">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onView(track)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onEdit(track)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onDelete(track)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-500 transition-colors duration-150"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 flex items-center justify-between px-1"
      >
        <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
          {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-600">
          Sorted by{" "}
          <span className="font-medium text-neutral-600 dark:text-neutral-400 capitalize">
            {sortKey}
          </span>{" "}
          {sortDir === "asc" ? "↑" : "↓"}
        </span>
      </motion.div>
    </div>
  );
}
