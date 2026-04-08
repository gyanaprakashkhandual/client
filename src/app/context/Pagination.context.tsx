'use client';
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type PaginationSize = "sm" | "md" | "lg" | "xl";
export type PaginationVariant = "default" | "filled" | "ghost" | "outline";
export type PaginationShape = "rounded" | "square" | "pill";
export type PaginationLayout = "default" | "compact" | "minimal" | "extended";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  size: PaginationSize;
  variant: PaginationVariant;
  shape: PaginationShape;
  layout: PaginationLayout;
  disabled: boolean;
}

type PaginationAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "NEXT_PAGE" }
  | { type: "PREV_PAGE" }
  | { type: "FIRST_PAGE" }
  | { type: "LAST_PAGE" }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_DISABLED"; payload: boolean };

function paginationReducer(
  state: PaginationState,
  action: PaginationAction,
): PaginationState {
  switch (action.type) {
    case "SET_PAGE": {
      const page = Math.max(1, Math.min(action.payload, state.totalPages));
      return { ...state, currentPage: page };
    }
    case "NEXT_PAGE":
      return {
        ...state,
        currentPage: Math.min(state.currentPage + 1, state.totalPages),
      };
    case "PREV_PAGE":
      return {
        ...state,
        currentPage: Math.max(state.currentPage - 1, 1),
      };
    case "FIRST_PAGE":
      return { ...state, currentPage: 1 };
    case "LAST_PAGE":
      return { ...state, currentPage: state.totalPages };
    case "SET_PAGE_SIZE": {
      const newTotalPages = Math.max(
        1,
        Math.ceil(state.totalItems / action.payload),
      );
      return {
        ...state,
        pageSize: action.payload,
        totalPages: newTotalPages,
        currentPage: Math.min(state.currentPage, newTotalPages),
      };
    }
    case "SET_DISABLED":
      return { ...state, disabled: action.payload };
    default:
      return state;
  }
}

export interface PaginationContextValue {
  state: PaginationState;
  dispatch: React.Dispatch<PaginationAction>;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setPageSize: (size: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

export interface PaginationProviderProps {
  children: React.ReactNode;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  size?: PaginationSize;
  variant?: PaginationVariant;
  shape?: PaginationShape;
  layout?: PaginationLayout;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function PaginationProvider({
  children,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  size = "md",
  variant = "default",
  shape = "rounded",
  layout = "default",
  disabled = false,
  onPageChange,
  onPageSizeChange,
}: PaginationProviderProps) {
  const [state, dispatch] = useReducer(paginationReducer, {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    size,
    variant,
    shape,
    layout,
    disabled,
  });

  const containerRef = useRef<HTMLElement>(null);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, state.totalPages));
      dispatch({ type: "SET_PAGE", payload: clamped });
      onPageChange?.(clamped);
    },
    [state.totalPages, onPageChange],
  );

  const nextPage = useCallback(() => {
    if (state.currentPage >= state.totalPages) return;
    const next = state.currentPage + 1;
    dispatch({ type: "NEXT_PAGE" });
    onPageChange?.(next);
  }, [state.currentPage, state.totalPages, onPageChange]);

  const prevPage = useCallback(() => {
    if (state.currentPage <= 1) return;
    const prev = state.currentPage - 1;
    dispatch({ type: "PREV_PAGE" });
    onPageChange?.(prev);
  }, [state.currentPage, onPageChange]);

  const firstPage = useCallback(() => {
    dispatch({ type: "FIRST_PAGE" });
    onPageChange?.(1);
  }, [onPageChange]);

  const lastPage = useCallback(() => {
    dispatch({ type: "LAST_PAGE" });
    onPageChange?.(state.totalPages);
  }, [state.totalPages, onPageChange]);

  const setPageSize = useCallback(
    (size: number) => {
      dispatch({ type: "SET_PAGE_SIZE", payload: size });
      onPageSizeChange?.(size);
    },
    [onPageSizeChange],
  );

  const canGoNext = state.currentPage < state.totalPages;
  const canGoPrev = state.currentPage > 1;

  return (
    <PaginationContext.Provider
      value={{
        state,
        dispatch,
        goToPage,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        setPageSize,
        canGoNext,
        canGoPrev,
        containerRef,
        onPageChange,
        onPageSizeChange,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
}

export function usePaginationContext(): PaginationContextValue {
  const ctx = useContext(PaginationContext);
  if (!ctx)
    throw new Error(
      "usePaginationContext must be used within PaginationProvider",
    );
  return ctx;
}