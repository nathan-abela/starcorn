"use client";

import type { RateLimitInfo } from "@/types";

interface RateLimitIndicatorProps {
  rateLimit: RateLimitInfo;
}

export function RateLimitIndicator({ rateLimit }: RateLimitIndicatorProps) {
  const percentage = (rateLimit.remaining / rateLimit.limit) * 100;
  const isLow = percentage < 20;
  const resetTime = rateLimit.resetAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="text-muted-foreground text-xs">
      <span className={isLow ? "text-amber-500" : ""}>
        {rateLimit.remaining.toLocaleString()}/{rateLimit.limit.toLocaleString()}
      </span>{" "}
      API requests remaining
      {isLow && <span className="text-muted-foreground"> · Resets at {resetTime}</span>}
    </div>
  );
}
