'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  PaginationProvider,
  usePaginationContext,
  type PaginationProviderProps,
  type PaginationSize,
  type PaginationVariant,
  type PaginationShape,
  type PaginationLayout,
} from "../context/Pagination.context";

const sizeConfig = {
  sm: {
    btnSize: "w-7 h-7",
    btnText: "text-xs",
    iconSize: 13,
    gap: "gap-0.5",
    infoText: "text-xs",
    inputW: "w-10",
    inputH: "h-7",
    inputText: "text-xs",
    selectH: "h-7",
    selectText: "text-xs",
    selectPx: "px-2",
    dropdownText: "text-xs",
    dropdownPx: "px-2",
    dropdownPy: "py-1",
    wrapGap: "gap-2",
    labelText: "text-xs",
  },
  md: {
    btnSize: "w-9 h-9",
    btnText: "text-sm",
    iconSize: 15,
    gap: "gap-1",
    infoText: "text-sm",
    inputW: "w-12",
    inputH: "h-9",
    inputText: "text-sm",
    selectH: "h-9",
    selectText: "text-sm",
    selectPx: "px-2.5",
    dropdownText: "text-sm",
    dropdownPx: "px-2.5",
    dropdownPy: "py-1.5",
    wrapGap: "gap-3",
    labelText: "text-sm",
  },
  lg: {
    btnSize: "w-10 h-10",
    btnText: "text-sm",
    iconSize: 16,
    gap: "gap-1",
    infoText: "text-sm",
    inputW: "w-14",
    inputH: "h-10",
    inputText: "text-sm",
    selectH: "h-10",
    selectText: "text-sm",
    selectPx: "px-3",
    dropdownText: "text-sm",
    dropdownPx: "px-3",
    dropdownPy: "py-2",
    wrapGap: "gap-3",
    labelText: "text-sm",
  },
  xl: {
    btnSize: "w-11 h-11",
    btnText: "text-base",
    iconSize: 17,
    gap: "gap-1.5",
    infoText: "text-base",
    inputW: "w-16",
    inputH: "h-11",
    inputText: "text-base",
    selectH: "h-11",
    selectText: "text-base",
    selectPx: "px-3.5",
    dropdownText: "text-base",
    dropdownPx: "px-3.5",
    dropdownPy: "py-2",
    wrapGap: "gap-4",
    labelText: "text-base",
  },
};

const shapeConfig: Record<PaginationShape, string> = {
  rounded: "rounded-lg",
  square: "rounded-none",
  pill: "rounded-full",
};

type ButtonState = "active" | "inactive" | "disabled" | "nav";

function getVariantStyles(
  variant: PaginationVariant,
  btnState: ButtonState,
): string {
  if (btnState === "disabled") {
    return "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600";
  }

  const map: Record<PaginationVariant, Record<"active" | "inactive" | "nav", string>> = {
    default: {
      active:
        "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold shadow-sm",
      inactive:
        "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium",
      nav: "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
    },
    filled: {
      active:
        "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold shadow-sm",
      inactive:
        "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium",
      nav: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
    },
    ghost: {
      active:
        "text-gray-900 dark:text-white font-semibold underline underline-offset-2",
      inactive:
        "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium",
      nav: "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white",
    },
    outline: {
      active:
        "border border-gray-900 dark:border-white text-gray-900 dark:text-white font-semibold",
      inactive:
        "border border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white font-medium",
      nav: "border border-transparent text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white",
    },
  };

  return map[variant][btnState as "active" | "inactive" | "nav"];
}

function generatePageRange(
  current: number,
  total: number,
  siblings: number,
): (number | "ellipsis-start" | "ellipsis-end")[] {
  const totalPageNumbers = siblings * 2 + 5;

  if (totalPageNumbers >= total) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(current - siblings, 1);
  const rightSiblingIndex = Math.min(current + siblings, total);
  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < total - 1;

  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis-start");
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) pages.push(i);
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== total) pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("ellipsis-end");
  } else {
    for (let i = rightSiblingIndex + 1; i < total; i++) pages.push(i);
  }

  pages.push(total);

  return pages;
}

interface PageButtonProps {
  page: number;
  isActive: boolean;
  size: PaginationSize;
  variant: PaginationVariant;
  shape: PaginationShape;
  disabled?: boolean;
  itemClassName?: string;
  activeItemClassName?: string;
}

function PageButton({
  page,
  isActive,
  size,
  variant,
  shape,
  disabled,
  itemClassName = "",
  activeItemClassName = "",
}: PageButtonProps) {
  const { goToPage, state } = usePaginationContext();
  const s = sizeConfig[size];
  const isDisabled = disabled || state.disabled;

  const btnState: ButtonState = isDisabled
    ? "disabled"
    : isActive
      ? "active"
      : "inactive";

  return (
    <motion.button
      type="button"
      disabled={isDisabled || isActive}
      onClick={() => goToPage(page)}
      whileTap={!isDisabled && !isActive ? { scale: 0.92 } : {}}
      className={`
        flex items-center justify-center shrink-0 ${s.btnSize} ${s.btnText}
        ${shapeConfig[shape]} transition-colors duration-100 select-none tabular-nums
        ${getVariantStyles(variant, btnState)}
        ${itemClassName}
        ${isActive ? activeItemClassName : ""}
      `}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Page ${page}`}
    >
      {page}
    </motion.button>
  );
}

interface NavButtonProps {
  direction: "first" | "prev" | "next" | "last";
  size: PaginationSize;
  variant: PaginationVariant;
  shape: PaginationShape;
  showFirstLast?: boolean;
  navButtonClassName?: string;
}

function NavButton({
  direction,
  size,
  variant,
  shape,
  navButtonClassName = "",
}: NavButtonProps) {
  const { nextPage, prevPage, firstPage, lastPage, canGoNext, canGoPrev, state } =
    usePaginationContext();
  const s = sizeConfig[size];

  const canAct =
    (direction === "next" || direction === "last") ? canGoNext : canGoPrev;
  const isDisabled = state.disabled || !canAct;

  const btnState: ButtonState = isDisabled ? "disabled" : "nav";

  const handleClick = () => {
    if (isDisabled) return;
    if (direction === "next") nextPage();
    else if (direction === "prev") prevPage();
    else if (direction === "first") firstPage();
    else lastPage();
  };

  const ariaLabels = {
    first: "First page",
    prev: "Previous page",
    next: "Next page",
    last: "Last page",
  };

  const icons = {
    first: <ChevronsLeft size={s.iconSize} />,
    prev: <ChevronLeft size={s.iconSize} />,
    next: <ChevronRight size={s.iconSize} />,
    last: <ChevronsRight size={s.iconSize} />,
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      aria-label={ariaLabels[direction]}
      className={`
        flex items-center justify-center shrink-0 ${s.btnSize}
        ${shapeConfig[shape]} transition-colors duration-100 select-none
        ${getVariantStyles(variant, btnState)}
        ${navButtonClassName}
      `}
    >
      {icons[direction]}
    </button>
  );
}

interface EllipsisButtonProps {
  type: "ellipsis-start" | "ellipsis-end";
  size: PaginationSize;
  variant: PaginationVariant;
  shape: PaginationShape;
  currentPage: number;
  totalPages: number;
  siblings: number;
}

function EllipsisButton({
  type,
  size,
  variant,
  shape,
  currentPage,
  totalPages,
  siblings,
}: EllipsisButtonProps) {
  const { goToPage, state } = usePaginationContext();
  const s = sizeConfig[size];
  const [hovered, setHovered] = useState(false);

  const jumpPage =
    type === "ellipsis-start"
      ? Math.max(1, currentPage - siblings * 2 - 1)
      : Math.min(totalPages, currentPage + siblings * 2 + 1);

  const ariaLabel =
    type === "ellipsis-start"
      ? `Jump back ${siblings * 2 + 1} pages`
      : `Jump forward ${siblings * 2 + 1} pages`;

  return (
    <button
      type="button"
      disabled={state.disabled}
      onClick={() => goToPage(jumpPage)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={ariaLabel}
      className={`
        flex items-center justify-center shrink-0 ${s.btnSize} ${s.btnText}
        ${shapeConfig[shape]} transition-colors duration-100 select-none
        text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800
        hover:text-gray-700 dark:hover:text-gray-300
        ${state.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {hovered ? (
          <motion.span
            key="chevrons"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.1 }}
            className="flex items-center justify-center"
          >
            {type === "ellipsis-start" ? (
              <ChevronsLeft size={s.iconSize} />
            ) : (
              <ChevronsRight size={s.iconSize} />
            )}
          </motion.span>
        ) : (
          <motion.span
            key="dots"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.1 }}
          >
            <MoreHorizontal size={s.iconSize} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

interface GoToInputProps {
  size: PaginationSize;
  shape: PaginationShape;
  inputClassName?: string;
}

function GoToInput({ size, shape, inputClassName = "" }: GoToInputProps) {
  const { goToPage, state } = usePaginationContext();
  const s = sizeConfig[size];
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = parseInt(value, 10);
      if (!isNaN(page)) {
        goToPage(page);
        setValue("");
      }
    }
  };

  const shapeToInput: Record<PaginationShape, string> = {
    rounded: "rounded-lg",
    square: "rounded-none",
    pill: "rounded-full",
  };

  return (
    <div className={`flex items-center ${s.wrapGap}`}>
      <span
        className={`shrink-0 ${s.labelText} text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap`}
      >
        Go to
      </span>
      <input
        type="number"
        min={1}
        max={state.totalPages}
        value={value}
        disabled={state.disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="—"
        aria-label="Go to page"
        className={`
          ${s.inputW} ${s.inputH} ${s.inputText} text-center
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-white
          placeholder-gray-300 dark:placeholder-gray-600
          ${shapeToInput[shape]}
          outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0
          focus:border-transparent transition-all duration-100
          disabled:opacity-40 disabled:cursor-not-allowed
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          ${inputClassName}
        `}
      />
    </div>
  );
}

interface PageSizeSelectProps {
  options: number[];
  size: PaginationSize;
  shape: PaginationShape;
  selectClassName?: string;
}

function PageSizeSelect({
  options,
  size,
  shape,
  selectClassName = "",
}: PageSizeSelectProps) {
  const { setPageSize, state } = usePaginationContext();
  const s = sizeConfig[size];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const shapeToDropdown: Record<PaginationShape, string> = {
    rounded: "rounded-xl",
    square: "rounded-none",
    pill: "rounded-2xl",
  };

  const shapeToTrigger: Record<PaginationShape, string> = {
    rounded: "rounded-lg",
    square: "rounded-none",
    pill: "rounded-full",
  };

  return (
    <div className={`flex items-center ${s.wrapGap}`}>
      <span
        className={`shrink-0 ${s.labelText} text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap`}
      >
        Rows per page
      </span>

      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={state.disabled}
          onClick={() => setOpen((v) => !v)}
          className={`
            flex items-center gap-1.5 ${s.selectPx} ${s.selectH} ${s.selectText}
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            text-gray-700 dark:text-gray-300 font-medium
            ${shapeToTrigger[shape]}
            outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white
            transition-colors duration-100
            hover:border-gray-300 dark:hover:border-gray-600
            disabled:opacity-40 disabled:cursor-not-allowed
            ${selectClassName}
          `}
          aria-label="Rows per page"
        >
          <span>{state.pageSize}</span>
          <ChevronDown
            size={s.iconSize - 3}
            className={`shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.13, ease: "easeOut" }}
              className={`absolute top-full left-0 mt-1.5 min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ${shapeToDropdown[shape]} shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden z-50`}
            >
              <div className="p-1">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setPageSize(opt);
                      setOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-center ${s.dropdownPx} ${s.dropdownPy}
                      ${s.dropdownText} font-medium transition-colors duration-100
                      ${state.pageSize === opt
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      rounded-md
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ItemsInfoProps {
  size: PaginationSize;
  infoClassName?: string;
}

function ItemsInfo({ size, infoClassName = "" }: ItemsInfoProps) {
  const { state } = usePaginationContext();
  const s = sizeConfig[size];

  if (!state.totalItems) return null;

  const start = (state.currentPage - 1) * state.pageSize + 1;
  const end = Math.min(state.currentPage * state.pageSize, state.totalItems);

  return (
    <span
      className={`shrink-0 ${s.infoText} text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap ${infoClassName}`}
    >
      {start}–{end} of {state.totalItems}
    </span>
  );
}

interface CompactDisplayProps {
  size: PaginationSize;
  infoClassName?: string;
}

function CompactDisplay({ size, infoClassName = "" }: CompactDisplayProps) {
  const { state } = usePaginationContext();
  const s = sizeConfig[size];

  return (
    <span
      className={`shrink-0 ${s.infoText} text-gray-900 dark:text-white font-semibold whitespace-nowrap tabular-nums ${infoClassName}`}
    >
      {state.currentPage}{" "}
      <span className="text-gray-400 dark:text-gray-500 font-normal">of</span>{" "}
      {state.totalPages}
    </span>
  );
}

interface PaginationInnerProps {
  size: PaginationSize;
  variant: PaginationVariant;
  shape: PaginationShape;
  layout: PaginationLayout;
  siblings?: number;
  showFirstLast?: boolean;
  showGoTo?: boolean;
  showPageSize?: boolean;
  showItemsInfo?: boolean;
  pageSizeOptions?: number[];
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  navButtonClassName?: string;
  inputClassName?: string;
  selectClassName?: string;
  infoClassName?: string;
}

function PaginationInner({
  size,
  variant,
  shape,
  layout,
  siblings = 1,
  showFirstLast = false,
  showGoTo = false,
  showPageSize = false,
  showItemsInfo = false,
  pageSizeOptions = [10, 20, 50, 100],
  startContent,
  endContent,
  className = "",
  listClassName = "",
  itemClassName = "",
  activeItemClassName = "",
  navButtonClassName = "",
  inputClassName = "",
  selectClassName = "",
  infoClassName = "",
}: PaginationInnerProps) {
  const { state } = usePaginationContext();
  const s = sizeConfig[size];
  const { currentPage, totalPages } = state;

  const pages = generatePageRange(currentPage, totalPages, siblings);

  if (layout === "compact") {
    return (
      <nav
        aria-label="Pagination"
        className={`flex items-center flex-wrap ${s.wrapGap} ${className}`}
      >
        {startContent}
        {showItemsInfo && <ItemsInfo size={size} infoClassName={infoClassName} />}
        {showItemsInfo && <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 shrink-0" />}
        <div className={`flex items-center ${s.gap}`}>
          {showFirstLast && (
            <NavButton
              direction="first"
              size={size}
              variant={variant}
              shape={shape}
              navButtonClassName={navButtonClassName}
            />
          )}
          <NavButton
            direction="prev"
            size={size}
            variant={variant}
            shape={shape}
            navButtonClassName={navButtonClassName}
          />
          <CompactDisplay size={size} infoClassName={infoClassName} />
          <NavButton
            direction="next"
            size={size}
            variant={variant}
            shape={shape}
            navButtonClassName={navButtonClassName}
          />
          {showFirstLast && (
            <NavButton
              direction="last"
              size={size}
              variant={variant}
              shape={shape}
              navButtonClassName={navButtonClassName}
            />
          )}
        </div>
        {showGoTo && (
          <>
            <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 shrink-0" />
            <GoToInput size={size} shape={shape} inputClassName={inputClassName} />
          </>
        )}
        {endContent}
      </nav>
    );
  }

  if (layout === "minimal") {
    return (
      <nav
        aria-label="Pagination"
        className={`flex items-center ${s.gap} ${className}`}
      >
        {startContent}
        <NavButton
          direction="prev"
          size={size}
          variant={variant}
          shape={shape}
          navButtonClassName={navButtonClassName}
        />
        <NavButton
          direction="next"
          size={size}
          variant={variant}
          shape={shape}
          navButtonClassName={navButtonClassName}
        />
        {endContent}
      </nav>
    );
  }

  if (layout === "extended") {
    return (
      <nav
        aria-label="Pagination"
        className={`flex items-center flex-wrap justify-between w-full ${s.wrapGap} ${className}`}
      >
        <div className={`flex items-center ${s.wrapGap}`}>
          {startContent}
          {showItemsInfo && (
            <ItemsInfo size={size} infoClassName={infoClassName} />
          )}
          {showPageSize && (
            <PageSizeSelect
              options={pageSizeOptions}
              size={size}
              shape={shape}
              selectClassName={selectClassName}
            />
          )}
        </div>

        <ol
          className={`flex items-center ${s.gap} ${listClassName}`}
          aria-label="Page list"
        >
          {showFirstLast && (
            <li>
              <NavButton
                direction="first"
                size={size}
                variant={variant}
                shape={shape}
                navButtonClassName={navButtonClassName}
              />
            </li>
          )}
          <li>
            <NavButton
              direction="prev"
              size={size}
              variant={variant}
              shape={shape}
              navButtonClassName={navButtonClassName}
            />
          </li>

          {pages.map((page, idx) =>
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <li key={page}>
                <EllipsisButton
                  type={page}
                  size={size}
                  variant={variant}
                  shape={shape}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  siblings={siblings}
                />
              </li>
            ) : (
              <li key={page}>
                <PageButton
                  page={page}
                  isActive={page === currentPage}
                  size={size}
                  variant={variant}
                  shape={shape}
                  itemClassName={itemClassName}
                  activeItemClassName={activeItemClassName}
                />
              </li>
            ),
          )}

          <li>
            <NavButton
              direction="next"
              size={size}
              variant={variant}
              shape={shape}
              navButtonClassName={navButtonClassName}
            />
          </li>
          {showFirstLast && (
            <li>
              <NavButton
                direction="last"
                size={size}
                variant={variant}
                shape={shape}
                navButtonClassName={navButtonClassName}
              />
            </li>
          )}
        </ol>

        <div className={`flex items-center ${s.wrapGap}`}>
          {showGoTo && (
            <GoToInput
              size={size}
              shape={shape}
              inputClassName={inputClassName}
            />
          )}
          {endContent}
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center flex-wrap ${s.wrapGap} ${className}`}
    >
      {startContent}

      <ol
        className={`flex items-center ${s.gap} ${listClassName}`}
        aria-label="Page list"
      >
        {showFirstLast && (
          <li>
            <NavButton
              direction="first"
              size={size}
              variant={variant}
              shape={shape}
              navButtonClassName={navButtonClassName}
            />
          </li>
        )}
        <li>
          <NavButton
            direction="prev"
            size={size}
            variant={variant}
            shape={shape}
            navButtonClassName={navButtonClassName}
          />
        </li>

        {pages.map((page) =>
          page === "ellipsis-start" || page === "ellipsis-end" ? (
            <li key={page}>
              <EllipsisButton
                type={page}
                size={size}
                variant={variant}
                shape={shape}
                currentPage={currentPage}
                totalPages={totalPages}
                siblings={siblings}
              />
            </li>
          ) : (
            <li key={page}>
              <PageButton
                page={page}
                isActive={page === currentPage}
                size={size}
                variant={variant}
                shape={shape}
                itemClassName={itemClassName}
                activeItemClassName={activeItemClassName}
              />
            </li>
          ),
        )}

        <li>
          <NavButton
            direction="next"
            size={size}
            variant={variant}
            shape={shape}
            navButtonClassName={navButtonClassName}
          />
        </li>
        {showFirstLast && (
          <li>
            <NavButton
              direction="last"
              size={size}
              variant={variant}
              shape={shape}
              navButtonClassName={navButtonClassName}
            />
          </li>
        )}
      </ol>

      {showItemsInfo && (
        <ItemsInfo size={size} infoClassName={infoClassName} />
      )}
      {showPageSize && (
        <PageSizeSelect
          options={pageSizeOptions}
          size={size}
          shape={shape}
          selectClassName={selectClassName}
        />
      )}
      {showGoTo && (
        <GoToInput size={size} shape={shape} inputClassName={inputClassName} />
      )}

      {endContent}
    </nav>
  );
}

export interface PaginationProps extends Omit<PaginationProviderProps, "children"> {
  size?: PaginationSize;
  variant?: PaginationVariant;
  shape?: PaginationShape;
  layout?: PaginationLayout;
  siblings?: number;
  showFirstLast?: boolean;
  showGoTo?: boolean;
  showPageSize?: boolean;
  showItemsInfo?: boolean;
  pageSizeOptions?: number[];
  disabled?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  navButtonClassName?: string;
  inputClassName?: string;
  selectClassName?: string;
  infoClassName?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  size = "md",
  variant = "default",
  shape = "rounded",
  layout = "default",
  siblings = 1,
  showFirstLast = false,
  showGoTo = false,
  showPageSize = false,
  showItemsInfo = false,
  pageSizeOptions = [10, 20, 50, 100],
  disabled = false,
  startContent,
  endContent,
  className = "",
  listClassName = "",
  itemClassName = "",
  activeItemClassName = "",
  navButtonClassName = "",
  inputClassName = "",
  selectClassName = "",
  infoClassName = "",
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <PaginationProvider
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      size={size}
      variant={variant}
      shape={shape}
      layout={layout}
      disabled={disabled}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    >
      <PaginationInner
        size={size}
        variant={variant}
        shape={shape}
        layout={layout}
        siblings={siblings}
        showFirstLast={showFirstLast}
        showGoTo={showGoTo}
        showPageSize={showPageSize}
        showItemsInfo={showItemsInfo}
        pageSizeOptions={pageSizeOptions}
        startContent={startContent}
        endContent={endContent}
        className={className}
        listClassName={listClassName}
        itemClassName={itemClassName}
        activeItemClassName={activeItemClassName}
        navButtonClassName={navButtonClassName}
        inputClassName={inputClassName}
        selectClassName={selectClassName}
        infoClassName={infoClassName}
      />
    </PaginationProvider>
  );
}

export { PaginationProvider, usePaginationContext };
export type { PaginationSize, PaginationVariant, PaginationShape, PaginationLayout };