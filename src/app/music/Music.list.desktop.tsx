// src/components/music/MusicListDesktop.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { IMusic } from "./Music.type";


type Props = {
  items: IMusic[];
  onEdit: (item: IMusic) => void;
  onDelete: (item: IMusic) => void;
};

export default function MusicListDesktop({ items, onEdit, onDelete }: Props) {
  return (
    <div className="hidden md:block rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
            {["Cover", "Title", "Artist", "Album", "Genre", "Duration", "Released", ""].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-neutral-400 dark:text-neutral-600 text-[13px]">
                  No music found
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
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
                  {/* <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 tabular-nums">{formatDuration(item.duration)}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 whitespace-nowrap">{formatDate(item.releaseDate)}</td> */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => onEdit(item)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
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
  );
}