export const positionClasses: Record<string, string> = {
  top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
  bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  left: "right-full mr-2 top-1/2 -translate-y-1/2",
  right: "left-full ml-2 top-1/2 -translate-y-1/2",
  "top-left": "bottom-full mb-2 right-0",
  "top-right": "bottom-full mb-2 left-0",
  "bottom-left": "top-full mt-2 right-0",
  "bottom-right": "top-full mt-2 left-0",
  "left-top": "right-full mr-2 bottom-0",
  "left-bottom": "right-full mr-2 top-0",
  "right-top": "left-full ml-2 bottom-0",
  "right-bottom": "left-full ml-2 top-0",
};

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

export const calculatePosition = (
  triggerRect: Rect,
  tooltipRect: Rect,
  position: string,
): string => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const spaceRight = viewportWidth - triggerRect.right;
  const spaceLeft = triggerRect.left;

  let newPosition = position;

  if (
    position === "top" ||
    position === "top-left" ||
    position === "top-right"
  ) {
    if (spaceAbove < 60 && spaceBelow > spaceAbove) {
      newPosition =
        position === "top"
          ? "bottom"
          : position === "top-left"
            ? "bottom-left"
            : "bottom-right";
    }
  } else if (
    position === "bottom" ||
    position === "bottom-left" ||
    position === "bottom-right"
  ) {
    if (spaceBelow < 60 && spaceAbove > spaceBelow) {
      newPosition =
        position === "bottom"
          ? "top"
          : position === "bottom-left"
            ? "top-left"
            : "top-right";
    }
  }

  if (newPosition.includes("left")) {
    if (spaceLeft < tooltipRect.width && spaceRight > spaceLeft) {
      newPosition = newPosition.replace("left", "right");
    }
  } else if (newPosition.includes("right")) {
    if (spaceRight < tooltipRect.width && spaceLeft > spaceRight) {
      newPosition = newPosition.replace("right", "left");
    }
  } else {
    if (spaceRight < tooltipRect.width / 2 && spaceLeft > spaceRight) {
      newPosition = newPosition + "-left";
    } else if (spaceLeft < tooltipRect.width / 2 && spaceRight > spaceLeft) {
      newPosition = newPosition + "-right";
    }
  }

  return newPosition;
};

export interface TooltipPortalPosition {
  top: number;
  left: number;
  transformOrigin: string;
}

export function computeTooltipPortalPosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  resolvedPosition: string,
): TooltipPortalPosition {
  const gap = 8;
  let top = 0;
  let left = 0;
  let transformOrigin = "center bottom";

  const cx = triggerRect.left + triggerRect.width / 2 + window.scrollX;
  const ty = triggerRect.top + window.scrollY;
  const by = triggerRect.bottom + window.scrollY;
  const lx = triggerRect.left + window.scrollX;
  const rx = triggerRect.right + window.scrollX;
  const my = triggerRect.top + triggerRect.height / 2 + window.scrollY;

  switch (resolvedPosition) {
    case "top":
      top = ty - tooltipRect.height - gap;
      left = cx - tooltipRect.width / 2;
      transformOrigin = "center bottom";
      break;
    case "top-left":
      top = ty - tooltipRect.height - gap;
      left = rx - tooltipRect.width;
      transformOrigin = "right bottom";
      break;
    case "top-right":
      top = ty - tooltipRect.height - gap;
      left = lx;
      transformOrigin = "left bottom";
      break;
    case "bottom":
      top = by + gap;
      left = cx - tooltipRect.width / 2;
      transformOrigin = "center top";
      break;
    case "bottom-left":
      top = by + gap;
      left = rx - tooltipRect.width;
      transformOrigin = "right top";
      break;
    case "bottom-right":
      top = by + gap;
      left = lx;
      transformOrigin = "left top";
      break;
    case "left":
    case "left-top":
    case "left-bottom":
      top =
        resolvedPosition === "left"
          ? my - tooltipRect.height / 2
          : resolvedPosition === "left-top"
            ? by - tooltipRect.height
            : ty;
      left = lx - tooltipRect.width - gap;
      transformOrigin = "right center";
      break;
    case "right":
    case "right-top":
    case "right-bottom":
      top =
        resolvedPosition === "right"
          ? my - tooltipRect.height / 2
          : resolvedPosition === "right-top"
            ? by - tooltipRect.height
            : ty;
      left = rx + gap;
      transformOrigin = "left center";
      break;
    default:
      top = by + gap;
      left = cx - tooltipRect.width / 2;
      transformOrigin = "center top";
  }

  left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
  top = Math.max(
    8,
    Math.min(top, window.innerHeight + window.scrollY - tooltipRect.height - 8),
  );

  return { top, left, transformOrigin };
}

export const arrowPositionStyles: Record<string, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-[#3c4043] border-x-transparent border-b-transparent border-x-4 border-t-4 border-b-0",
  "top-left":
    "top-full right-3 border-t-[#3c4043] border-x-transparent border-b-transparent border-x-4 border-t-4 border-b-0",
  "top-right":
    "top-full left-3 border-t-[#3c4043] border-x-transparent border-b-transparent border-x-4 border-t-4 border-b-0",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-[#3c4043] border-x-transparent border-t-transparent border-x-4 border-b-4 border-t-0",
  "bottom-left":
    "bottom-full right-3 border-b-[#3c4043] border-x-transparent border-t-transparent border-x-4 border-b-4 border-t-0",
  "bottom-right":
    "bottom-full left-3 border-b-[#3c4043] border-x-transparent border-t-transparent border-x-4 border-b-4 border-t-0",
  left: "left-full top-1/2 -translate-y-1/2 border-l-[#3c4043] border-y-transparent border-r-transparent border-y-4 border-l-4 border-r-0",
  "left-top":
    "left-full bottom-3 border-l-[#3c4043] border-y-transparent border-r-transparent border-y-4 border-l-4 border-r-0",
  "left-bottom":
    "left-full top-3 border-l-[#3c4043] border-y-transparent border-r-transparent border-y-4 border-l-4 border-r-0",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-[#3c4043] border-y-transparent border-l-transparent border-y-4 border-r-4 border-l-0",
  "right-top":
    "right-full bottom-3 border-r-[#3c4043] border-y-transparent border-l-transparent border-y-4 border-r-4 border-l-0",
  "right-bottom":
    "right-full top-3 border-r-[#3c4043] border-y-transparent border-l-transparent border-y-4 border-r-4 border-l-0",
};