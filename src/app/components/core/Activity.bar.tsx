"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Music,
  Video,
  Mic,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { Tooltip } from "../Tooltip.ui";
import { GrDashboard } from "react-icons/gr";

const navItems = [
  { icon: GrDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Music, label: "Music", href: "/music" },
  { icon: Video, label: "Vlogs", href: "/vlogs" },
  { icon: Mic, label: "Podcast", href: "/podcast" },
  { icon: BookOpen, label: "Tutorials", href: "/tutorials" }
];

export default function ActivityBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="h-[calc(100vh-56px)] sticky top-14 w-14 flex flex-col items-center py-3 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 z-40 select-none shrink-0 overflow-hidden">
      <div className="flex flex-col items-center w-full px-2.5 mb-2.5 shrink-0">
        <div className="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer shrink-0 transition-all duration-150 hover:ring-2 hover:ring-zinc-400 dark:hover:ring-zinc-500">
          <Image
            src="https://res.cloudinary.com/dvytvjplt/image/upload/v1765866608/profile_pricture_oemv94.jpg"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="w-7 h-px bg-zinc-100 dark:bg-zinc-800 mb-2.5 shrink-0" />

      <nav className="flex flex-col items-center gap-0.5 w-full px-1.5 shrink-0">
        {navItems.map(({ icon: Icon, label, href }, index) => {
          const isActive = pathname === href;

          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.03,
                duration: 0.2,
                ease: "easeOut",
              }}
              className="w-full"
            >
              <Tooltip content={label} position="right">
                <button
                  onClick={() => router.push(href)}
                  aria-label={label}
                  className={[
                    "relative w-full flex items-center justify-center rounded-md p-2 transition-all duration-100 cursor-pointer outline-none",
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200",
                  ].join(" ")}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-zinc-900 dark:bg-zinc-100"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                  <Icon
                    size={16}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    className="shrink-0"
                  />
                </button>
              </Tooltip>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}