"use client";

import type { FetchProgress } from "@/types";

import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: FetchProgress;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  const percentage = Math.round((progress.currentPage / progress.totalPages) * 100);

  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Fetching page {progress.currentPage} of {progress.totalPages}...
        </span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} />
      <p className="text-muted-foreground mt-2 text-center text-xs">
        {progress.fetchedCount} stars fetched
        {progress.estimatedTotal > 0 && ` of ~${progress.estimatedTotal}`}
      </p>
    </div>
  );
}
