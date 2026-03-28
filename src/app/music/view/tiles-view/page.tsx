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
  Play,
} from "lucide-react";
import type { IMusic } from "@/app/lib/types";

interface MusicTileViewProps {
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

function formatYear(dateStr: string) {
  return new Date(dateStr).getFullYear();
}

const GENRE_PALETTES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  pop: {
    bg: "bg-pink-100 dark:bg-pink-950/60",
    text: "text-pink-600 dark:text-pink-400",
    dot: "bg-pink-400",
  },
  rock: {
    bg: "bg-orange-100 dark:bg-orange-950/60",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-400",
  },
  jazz: {
    bg: "bg-amber-100 dark:bg-amber-950/60",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-400",
  },
  hiphop: {
    bg: "bg-violet-100 dark:bg-violet-950/60",
    text: "text-violet-600 dark:text-violet-400",
    dot: "bg-violet-400",
  },
  electronic: {
    bg: "bg-cyan-100 dark:bg-cyan-950/60",
    text: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-400",
  },
  classical: {
    bg: "bg-stone-100 dark:bg-stone-800/60",
    text: "text-stone-600 dark:text-stone-400",
    dot: "bg-stone-400",
  },
  rb: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-950/60",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    dot: "bg-fuchsia-400",
  },
  country: {
    bg: "bg-yellow-100 dark:bg-yellow-950/60",
    text: "text-yellow-700 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
};

function getGenrePalette(genre: string) {
  const key = genre?.toLowerCase().replace(/[\s-]/g, "") ?? "";
  return (
    GENRE_PALETTES[key] ?? {
      bg: "bg-neutral-100 dark:bg-neutral-800",
      text: "text-neutral-600 dark:text-neutral-400",
      dot: "bg-neutral-400",
    }
  );
}

function SkeletonTile() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="aspect-square w-full animate-pulse bg-neutral-100 dark:bg-neutral-800" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </div>
  );
}

export default function MusicTileView({
  tracks,
  onEdit,
  onDelete,
  onView,
  isLoading,
}: MusicTileViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Ensure tracks is always an array
  const tracksArray = Array.isArray(tracks) ? tracks : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonTile key={i} />
        ))}
      </div>
    );
  }

  if (tracksArray.length === 0) {
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <AnimatePresence initial={false}>
        {tracksArray.map((track, i) => {
          const palette = getGenrePalette(track.genre);
          const isHovered = hoveredId === track._id;

          return (
            <motion.div
              key={track._id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -6 }}
              transition={{
                duration: 0.25,
                delay: i * 0.03,
                layout: { duration: 0.3 },
              }}
              onMouseEnter={() => setHoveredId(track._id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg dark:hover:shadow-neutral-950/50 transition-shadow duration-300"
            >
              <div
                className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer"
                onClick={() => onView(track)}
              >
                {track.coverImageUrl ? (
                  <motion.img
                    src={track.coverImageUrl}
                    alt={track.title}
                    animate={{ scale: isHovered ? 1.06 : 1 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Music2 className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                  </div>
                )}

                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
                />

                <motion.div
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg">
                    <Play
                      className="h-5 w-5 text-neutral-900 ml-0.5"
                      fill="currentColor"
                    />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5"
                >
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(track);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 shadow text-neutral-700 hover:bg-white transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(track);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 shadow text-rose-500 hover:bg-white transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </motion.button>
                </motion.div>

                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-xs font-mono"
                >
                  <Clock className="h-3 w-3" />
                  {formatDuration(track.duration)}
                </motion.div>
              </div>

              <div className="flex flex-col gap-1.5 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3
                      className="line-clamp-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      onClick={() => onView(track)}
                    >
                      {track.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-500">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {track.album && (
                  <p className="line-clamp-1 text-[11px] text-neutral-400 dark:text-neutral-600">
                    {track.album} · {formatYear(track.releaseDate)}
                  </p>
                )}

                <div className="flex items-center justify-between pt-0.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${palette.bg} ${palette.text}`}
                  >
                    <span className={`h-1 w-1 rounded-full ${palette.dot}`} />
                    {track.genre}
                  </span>

                  <div className="flex items-center gap-2.5 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-0.5">
                      <Heart className="h-3 w-3 text-rose-400" />
                      {track.likes?.length ?? 0}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="h-3 w-3 text-sky-400" />
                      {track.comments?.length ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
