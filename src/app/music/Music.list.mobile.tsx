// src/components/music/MusicListMobile.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { IMusic } from "./Music.type";


type Props = {
  items: IMusic[];
  onEdit: (item: IMusic) => void;
  onDelete: (item: IMusic) => void;
};

export default function MusicListMobile({ items, onEdit, onDelete }: Props) {
  return (
    <div className="md:hidden space-y-2">
      <AnimatePresence>
        {items.length === 0 ? (
          <p className="text-center text-neutral-400 dark:text-neutral-600 text-[13px] py-12">No music found</p>
        ) : (
          items.map((item, i) => (
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
                <p className="text-[12px] text-neutral-400 dark:text-neutral-500 truncate">
                  {item.artist} · {item.album}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                    {item.genre}
                  </span>
                  <span className="text-[11px] text-neutral-400">{formatDuration(item.duration)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
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
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}