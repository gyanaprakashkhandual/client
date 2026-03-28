"use client";

import { motion } from "framer-motion";
import { Music, Settings, Play } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Music",
    href: "/music",
    icon: <Music size={17} strokeWidth={1.6} />,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className="
      fixed left-0 top-0 h-screen w-60 z-40
      flex flex-col
      bg-white dark:bg-neutral-950
      border-r border-neutral-100 dark:border-neutral-800
    "
    >
      {/* Header */}
      <div className="px-6 pt-7 pb-6 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center shrink-0">
            <Play
              size={11}
              fill="white"
              stroke="white"
              className="dark:fill-black dark:stroke-black ml-0.5"
            />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-black dark:text-white">
            Workspace
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 select-none">
          Browse
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <button
                  onClick={() => router.push(item.href)}
                  className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left group"
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 shrink-0 transition-colors ${
                      isActive
                        ? "text-black dark:text-white"
                        : "text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`relative z-10 text-[13.5px] font-medium transition-colors ${
                      isActive
                        ? "text-black dark:text-white"
                        : "text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-neutral-100 dark:border-neutral-800">
        <button
          className="
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
          text-neutral-500 dark:text-neutral-400
          hover:bg-neutral-100 dark:hover:bg-neutral-800
          hover:text-black dark:hover:text-white
          transition-colors duration-150 group
        "
        >
          <Settings
            size={17}
            strokeWidth={1.6}
            className="shrink-0 transition-transform duration-300 group-hover:rotate-45"
          />
          <span className="text-[13.5px] font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
