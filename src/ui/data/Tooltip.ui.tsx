/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";
import { Check, Copy } from "lucide-react";
import {
  calculatePosition,
  computeTooltipPortalPosition,
  arrowPositionStyles,
} from "../context/Tooltip.context";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content?: string;
  children: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  maxWidth?: number;
  className?: string;
  showArrow?: boolean;
  showCopy?: boolean;
  disabled?: boolean;
}

const tooltipTransition: Transition = { duration: 0.15, ease: "easeOut" };

export const Tooltip = ({
  content = "",
  children,
  position = "bottom",
  delay = 0,
  maxWidth = 200,
  className = "",
  showArrow = false,
  showCopy = false,
  disabled = false,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [resolvedPosition, setResolvedPosition] = useState<string>(position);
  const [portalStyle, setPortalStyle] = useState<{
    top: number;
    left: number;
    transformOrigin: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const newPos = calculatePosition(triggerRect, tooltipRect, position);
    setResolvedPosition(newPos);
    const coords = computeTooltipPortalPosition(
      triggerRect,
      tooltipRect,
      newPos,
    );
    setPortalStyle(coords);
  }, [position]);

  useEffect(() => {
    if (!isVisible) return;
    const frame = requestAnimationFrame(updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible, updatePosition]);

  const show = useCallback(() => {
    if (disabled || !content) return;
    if (delayTimer.current) clearTimeout(delayTimer.current);
    if (delay > 0) {
      delayTimer.current = setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(true);
    }
  }, [disabled, content, delay]);

  const hide = useCallback(() => {
    if (delayTimer.current) clearTimeout(delayTimer.current);
    setIsVisible(false);
  }, []);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!content) return;
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        if (copyTimer.current) clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 1800);
      });
    },
    [content],
  );

  if (!content || disabled) {
    return <>{children}</>;
  }

  const tooltipNode = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          role="tooltip"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={tooltipTransition}
          style={{
            position: "fixed",
            top: portalStyle?.top ?? -9999,
            left: portalStyle?.left ?? -9999,
            transformOrigin: portalStyle?.transformOrigin ?? "center top",
            zIndex: 99999,
            maxWidth,
            pointerEvents: showCopy ? "auto" : "none",
          }}
          className={`
            bg-[#3c4043] text-white text-[13px] leading-[1.4] px-2.5 py-1.5
            rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.26)] font-normal
            flex items-center gap-1.5
          `}
        >
          {showArrow && (
            <span
              className={`absolute w-0 h-0 border-solid ${arrowPositionStyles[resolvedPosition] ?? arrowPositionStyles.bottom}`}
            />
          )}

          <span className="block truncate min-w-0 flex-1">{content}</span>

          {showCopy && (
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center justify-center w-4 h-4 rounded text-white/60 hover:text-white transition-colors duration-100"
              aria-label="Copy"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={triggerRef}
      className={`relative ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {mounted && createPortal(tooltipNode, document.body)}
    </div>
  );
};