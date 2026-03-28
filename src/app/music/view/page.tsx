"use client";

import { Suspense } from "react";

// Dynamic imports for view components
import ViewContent from "./view-content";

function LoadingPlaceholder() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="h-14 border-b border-neutral-100 dark:border-neutral-800" />
    </div>
  );
}

export default function MusicViewPage() {
  return (
    <Suspense fallback={<LoadingPlaceholder />}>
      <ViewContent />
    </Suspense>
  );
}
