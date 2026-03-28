/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music2,
  Plus,
  Moon,
  Sun,
  Monitor,
  Menu,
  Search,
  Filter,
  LayoutList,
  Grid3x3,
  Maximize2,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { clearMusicError } from "@/app/lib/features/music/music.slice";
import { selectMusicError } from "@/app/lib/features/music/music.selector";
import { useSidebar } from "@/app/context/Sidebar.context";
import { Tooltip } from "@/app/components/Tooltip.ui";
import ActionMenu from "@/app/components/Action.menu.ui";

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

const SORT_OPTIONS = ["Most Likes", "Most Comments", "Recently Added", "A-Z"];

const VIEW_OPTIONS = ["List View", "Grid View", "Full View"];

type ThemeMode = "light" | "dark" | "system";

interface NavbarProps {
  onAddClick: () => void;
  onRefresh: () => void;
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  genre: string;
  sortBy: string;
  viewType: string;
  searchQuery: string;
}

function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const applyDark = () => root.classList.add("dark");
    const applyLight = () => root.classList.remove("dark");

    if (theme === "dark") {
      applyDark();
    } else if (theme === "light") {
      applyLight();
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.matches ? applyDark() : applyLight();
      const handler = (e: MediaQueryListEvent) =>
        e.matches ? applyDark() : applyLight();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

function ViewIcon({
  viewType,
  size = 14,
}: {
  viewType: string;
  size?: number;
}) {
  if (viewType === "Grid View") return <Grid3x3 size={size} />;
  if (viewType === "Full View") return <Maximize2 size={size} />;
  return <LayoutList size={size} />;
}

function ThemeIcon({ theme, size = 14 }: { theme: ThemeMode; size?: number }) {
  if (theme === "dark") return <Moon size={size} />;
  if (theme === "light") return <Sun size={size} />;
  return <Monitor size={size} />;
}

function ActivePill({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black text-white dark:bg-white dark:text-black"
    >
      {label}
      <button
        onClick={onClear}
        className="ml-0.5 rounded-full hover:opacity-60 transition-opacity"
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </motion.span>
  );
}

function Navbar({ onAddClick, onFilterChange }: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectMusicError);
  const { isOpen, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();

  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    genre: "",
    sortBy: "",
    viewType: "List View",
    searchQuery: "",
  });

  const [genreMenuOpen, setGenreMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Read view type from URL
  useEffect(() => {
    const viewParam = searchParams.get("view") || "list-view";
    const viewTypeMap: Record<string, string> = {
      "list-view": "List View",
      "grid-view": "Grid View",
      "full-view": "Full View",
    };
    const viewType = viewTypeMap[viewParam] || "List View";
    setFilters((prev) => ({ ...prev, viewType }));
  }, [searchParams]);

  useEffect(() => {
    if (error) dispatch(clearMusicError());
  }, [error, dispatch]);

  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  const handleGenreChange = (genre: string) => {
    setFilters((prev) => ({ ...prev, genre }));
    setGenreMenuOpen(false);
  };
  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
    setSortMenuOpen(false);
  };
  const handleViewChange = (viewType: string) => {
    // Map view names to URL params
    const viewParamMap: Record<string, string> = {
      "List View": "list-view",
      "Grid View": "grid-view",
      "Full View": "full-view",
    };
    const viewParam = viewParamMap[viewType] || "list-view";
    
    // Navigate with query param
    const newUrl = `/music/view?view=${viewParam}`;
    router.push(newUrl);
    
    setFilters((prev) => ({ ...prev, viewType }));
    setViewMenuOpen(false);
  };
  const handleSearchChange = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  };

  const themeLabel: Record<ThemeMode, string> = {
    light: "Light",
    dark: "Dark",
    system: "System",
  };

  const btnBase =
    "shrink-0 h-8 text-xs rounded-lg transition-all duration-150 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500";

  const btnActive =
    "shrink-0 h-8 text-xs rounded-lg transition-all duration-150 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black";

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <Tooltip content={isOpen ? "Close sidebar" : "Open sidebar"}>
              <motion.button
                onClick={toggleSidebar}
                whileTap={{ scale: 0.92 }}
                className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-150"
              >
                <Menu size={18} strokeWidth={2} />
              </motion.button>
            </Tooltip>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-black dark:bg-white shadow-sm">
                <Music2 className="h-3.5 w-3.5 text-white dark:text-black" />
              </div>
              <h1 className="text-base font-bold leading-none tracking-tight text-black dark:text-white select-none">
                Music
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex flex-1 items-center gap-2 min-w-0">
            <div className="relative w-56 shrink-0">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                  searchFocused
                    ? "text-black dark:text-white"
                    : "text-neutral-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search tracks, artists…"
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-8 pl-9 pr-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200"
              />
              <AnimatePresence>
                {filters.searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    onClick={() => handleSearchChange("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <ActionMenu
              open={genreMenuOpen}
              onOpenChange={setGenreMenuOpen}
              position="bottom-end"
            >
              <ActionMenu.Button
                showChevron
                leadingIcon={<Filter size={14} />}
                variant="outline"
                size="sm"
                className={filters.genre ? btnActive : btnBase}
              >
                {filters.genre || "Genre"}
              </ActionMenu.Button>
              <ActionMenu.Overlay maxWidth={300} minWidth={200}>
                <ActionMenu.List
                  search={true}
                  searchPlaceholder="Search genres..."
                >
                  <ActionMenu.Group label="All Genres">
                    <ActionMenu.Item
                      selected={filters.genre === ""}
                      onSelect={() => handleGenreChange("")}
                    >
                      All Genres
                    </ActionMenu.Item>
                  </ActionMenu.Group>
                  <ActionMenu.Divider />
                  {GENRES.map((genre) => (
                    <ActionMenu.Item
                      key={genre}
                      selected={filters.genre === genre}
                      onSelect={() => handleGenreChange(genre)}
                    >
                      {genre}
                    </ActionMenu.Item>
                  ))}
                </ActionMenu.List>
              </ActionMenu.Overlay>
            </ActionMenu>

            <ActionMenu
              open={sortMenuOpen}
              onOpenChange={setSortMenuOpen}
              position="bottom-end"
            >
              <ActionMenu.Button
                showChevron
                leadingIcon={<Filter size={14} />}
                variant="outline"
                size="sm"
                className={filters.sortBy ? btnActive : btnBase}
              >
                {filters.sortBy || "Sort"}
              </ActionMenu.Button>
              <ActionMenu.Overlay maxWidth={300} minWidth={200}>
                <ActionMenu.List>
                  <ActionMenu.Group label="Sort By">
                    {SORT_OPTIONS.map((option) => (
                      <ActionMenu.Item
                        key={option}
                        selected={filters.sortBy === option}
                        onSelect={() => handleSortChange(option)}
                      >
                        {option}
                      </ActionMenu.Item>
                    ))}
                  </ActionMenu.Group>
                </ActionMenu.List>
              </ActionMenu.Overlay>
            </ActionMenu>

            <ActionMenu
              open={viewMenuOpen}
              onOpenChange={setViewMenuOpen}
              position="bottom-end"
            >
              <ActionMenu.Button
                showChevron
                leadingIcon={<ViewIcon viewType={filters.viewType} />}
                variant="outline"
                size="sm"
                className={btnBase}
              >
                {filters.viewType}
              </ActionMenu.Button>
              <ActionMenu.Overlay maxWidth={300} minWidth={200}>
                <ActionMenu.List>
                  <ActionMenu.Group label="View Options">
                    {VIEW_OPTIONS.map((option) => (
                      <ActionMenu.Item
                        key={option}
                        leadingIcon={<ViewIcon viewType={option} />}
                        selected={filters.viewType === option}
                        onSelect={() => handleViewChange(option)}
                      >
                        {option}
                      </ActionMenu.Item>
                    ))}
                  </ActionMenu.Group>
                </ActionMenu.List>
              </ActionMenu.Overlay>
            </ActionMenu>

            <ActionMenu
              open={themeMenuOpen}
              onOpenChange={setThemeMenuOpen}
              position="bottom-end"
            >
              <ActionMenu.Button
                showChevron
                leadingIcon={<ThemeIcon theme={theme} />}
                variant="outline"
                size="sm"
                className={btnBase}
              >
                {themeLabel[theme]}
              </ActionMenu.Button>
              <ActionMenu.Overlay maxWidth={220} minWidth={160}>
                <ActionMenu.List>
                  <ActionMenu.Group label="Appearance">
                    {(["light", "dark", "system"] as ThemeMode[]).map((t) => (
                      <ActionMenu.Item
                        key={t}
                        leadingIcon={<ThemeIcon theme={t} />}
                        selected={theme === t}
                        onSelect={() => {
                          setTheme(t);
                          setThemeMenuOpen(false);
                        }}
                      >
                        {themeLabel[t]}
                      </ActionMenu.Item>
                    ))}
                  </ActionMenu.Group>
                </ActionMenu.List>
              </ActionMenu.Overlay>
            </ActionMenu>

            <AnimatePresence>
              {filters.genre && (
                <ActivePill
                  key="genre-pill"
                  label={filters.genre}
                  onClear={() => handleGenreChange("")}
                />
              )}
              {filters.sortBy && (
                <ActivePill
                  key="sort-pill"
                  label={filters.sortBy}
                  onClear={() => setFilters((p) => ({ ...p, sortBy: "" }))}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {filters.genre && filters.sortBy && (
                <motion.button
                  key="clear-all"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  onClick={() =>
                    setFilters((p) => ({ ...p, genre: "", sortBy: "" }))
                  }
                  className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-150 shrink-0"
                >
                  Clear all
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
            <Tooltip content="Search">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setMobileSearchOpen((v) => !v)}
                className="sm:hidden p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-150"
              >
                {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
              </motion.button>
            </Tooltip>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={onAddClick}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-1.5 rounded-xl bg-black dark:bg-white px-3.5 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:shadow-md hover:opacity-85 transition-all duration-150"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Add Track</span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden sm:hidden pb-3"
            >
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search tracks, artists, albums…"
                    value={filters.searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full h-9 pl-9 pr-8 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all duration-200"
                  />
                  <AnimatePresence>
                    {filters.searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        onClick={() => handleSearchChange("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <X size={13} strokeWidth={2.5} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <ActionMenu
                    open={genreMenuOpen}
                    onOpenChange={setGenreMenuOpen}
                    position="bottom-end"
                  >
                    <ActionMenu.Button
                      showChevron
                      leadingIcon={<Filter size={14} />}
                      variant="outline"
                      size="sm"
                      className={filters.genre ? btnActive : btnBase}
                    >
                      {filters.genre || "Genre"}
                    </ActionMenu.Button>
                    <ActionMenu.Overlay maxWidth={300} minWidth={200}>
                      <ActionMenu.List
                        search={true}
                        searchPlaceholder="Search genres..."
                      >
                        <ActionMenu.Group label="All Genres">
                          <ActionMenu.Item
                            selected={filters.genre === ""}
                            onSelect={() => handleGenreChange("")}
                          >
                            All Genres
                          </ActionMenu.Item>
                        </ActionMenu.Group>
                        <ActionMenu.Divider />
                        {GENRES.map((genre) => (
                          <ActionMenu.Item
                            key={genre}
                            selected={filters.genre === genre}
                            onSelect={() => handleGenreChange(genre)}
                          >
                            {genre}
                          </ActionMenu.Item>
                        ))}
                      </ActionMenu.List>
                    </ActionMenu.Overlay>
                  </ActionMenu>

                  <ActionMenu
                    open={sortMenuOpen}
                    onOpenChange={setSortMenuOpen}
                    position="bottom-end"
                  >
                    <ActionMenu.Button
                      showChevron
                      leadingIcon={<Filter size={14} />}
                      variant="outline"
                      size="sm"
                      className={filters.sortBy ? btnActive : btnBase}
                    >
                      {filters.sortBy || "Sort"}
                    </ActionMenu.Button>
                    <ActionMenu.Overlay maxWidth={300} minWidth={200}>
                      <ActionMenu.List>
                        <ActionMenu.Group label="Sort By">
                          {SORT_OPTIONS.map((option) => (
                            <ActionMenu.Item
                              key={option}
                              selected={filters.sortBy === option}
                              onSelect={() => handleSortChange(option)}
                            >
                              {option}
                            </ActionMenu.Item>
                          ))}
                        </ActionMenu.Group>
                      </ActionMenu.List>
                    </ActionMenu.Overlay>
                  </ActionMenu>

                  <ActionMenu
                    open={viewMenuOpen}
                    onOpenChange={setViewMenuOpen}
                    position="bottom-end"
                  >
                    <ActionMenu.Button
                      showChevron
                      leadingIcon={<ViewIcon viewType={filters.viewType} />}
                      variant="outline"
                      size="sm"
                      className={btnBase}
                    >
                      {filters.viewType}
                    </ActionMenu.Button>
                    <ActionMenu.Overlay maxWidth={300} minWidth={200}>
                      <ActionMenu.List>
                        <ActionMenu.Group label="View Options">
                          {VIEW_OPTIONS.map((option) => (
                            <ActionMenu.Item
                              key={option}
                              leadingIcon={<ViewIcon viewType={option} />}
                              selected={filters.viewType === option}
                              onSelect={() => handleViewChange(option)}
                            >
                              {option}
                            </ActionMenu.Item>
                          ))}
                        </ActionMenu.Group>
                      </ActionMenu.List>
                    </ActionMenu.Overlay>
                  </ActionMenu>

                  <ActionMenu
                    open={themeMenuOpen}
                    onOpenChange={setThemeMenuOpen}
                    position="bottom-end"
                  >
                    <ActionMenu.Button
                      showChevron
                      leadingIcon={<ThemeIcon theme={theme} />}
                      variant="outline"
                      size="sm"
                      className={btnBase}
                    >
                      {themeLabel[theme]}
                    </ActionMenu.Button>
                    <ActionMenu.Overlay maxWidth={220} minWidth={160}>
                      <ActionMenu.List>
                        <ActionMenu.Group label="Appearance">
                          {(["light", "dark", "system"] as ThemeMode[]).map(
                            (t) => (
                              <ActionMenu.Item
                                key={t}
                                leadingIcon={<ThemeIcon theme={t} />}
                                selected={theme === t}
                                onSelect={() => {
                                  setTheme(t);
                                  setThemeMenuOpen(false);
                                }}
                              >
                                {themeLabel[t]}
                              </ActionMenu.Item>
                            ),
                          )}
                        </ActionMenu.Group>
                      </ActionMenu.List>
                    </ActionMenu.Overlay>
                  </ActionMenu>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;
