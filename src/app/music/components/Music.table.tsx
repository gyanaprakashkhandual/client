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
} from "lucide-react";
import type { IMusic } from "@/app/lib/types";

interface MusicTableProps {
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
    month: "short",
    day: "numeric",
  });
}

type SortKey = "title" | "artist" | "album" | "genre" | "releaseDate" | "duration";

export default function MusicTable({ tracks, onEdit, onDelete, isLoading }: MusicTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ChevronUp className="h-3 w-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 opacity-70" />
    ) : (
      <ChevronDown className="h-3 w-3 opacity-70" />
    );
  };

  const ThBtn = ({ col, children }: { col: SortKey; children: React.ReactNode }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
    >
      {children}
      <SortIcon col={col} />
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-700">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-6 w-6 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-black dark:border-t-white"
        />
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
        <Music2 className="h-8 w-8 text-neutral-300 dark:text-neutral-600" />
        <p className="text-sm text-neutral-400 dark:text-neutral-500">No tracks yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <th className="px-4 py-3 text-left">
                <ThBtn col="title">Title</ThBtn>
              </th>
              <th className="px-4 py-3 text-left">
                <ThBtn col="artist">Artist</ThBtn>
              </th>
              <th className="hidden px-4 py-3 text-left md:table-cell">
                <ThBtn col="album">Album</ThBtn>
              </th>
              <th className="hidden px-4 py-3 text-left lg:table-cell">
                <ThBtn col="genre">Genre</ThBtn>
              </th>
              <th className="hidden px-4 py-3 text-left xl:table-cell">
                <ThBtn col="releaseDate">Date</ThBtn>
              </th>
              <th className="hidden px-4 py-3 text-left sm:table-cell">
                <ThBtn col="duration">Duration</ThBtn>
              </th>
              <th className="hidden px-4 py-3 text-left lg:table-cell">
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Stats
                </span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
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
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="group border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  {/* Title + Cover */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                        {track.coverImageUrl ? (
                          <img
                            src={track.coverImageUrl}
                            alt={track.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Music2 className="h-4 w-4 text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-black dark:text-white line-clamp-1 max-w-[140px]">
                        {track.title}
                      </span>
                    </div>
                  </td>

                  {/* Artist */}
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {track.artist}
                  </td>

                  {/* Album */}
                  <td className="hidden px-4 py-3 text-neutral-500 dark:text-neutral-400 md:table-cell max-w-[120px]">
                    <span className="line-clamp-1">{track.album}</span>
                  </td>

                  {/* Genre */}
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      {track.genre}
                    </span>
                  </td>

                  {/* Release Date */}
                  <td className="hidden px-4 py-3 text-neutral-500 dark:text-neutral-400 xl:table-cell text-xs">
                    {formatDate(track.releaseDate)}
                  </td>

                  {/* Duration */}
                  <td className="hidden px-4 py-3 text-neutral-500 dark:text-neutral-400 sm:table-cell">
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {formatDuration(track.duration)}
                    </div>
                  </td>

                  {/* Stats */}
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-rose-400" />
                        {track.likes?.length ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 text-blue-400" />
                        {track.comments?.length ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(track)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-black dark:hover:text-white transition-all"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(track)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-500 transition-all"
                        title="Delete"
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
    </div>
  );
}