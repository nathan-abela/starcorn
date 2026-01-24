"use client";

import Link from "next/link";
import type { RateLimitInfo } from "@/types";
import { HelpCircle } from "lucide-react";

interface RateLimitIndicatorProps {
  rateLimit: RateLimitInfo;
}

export function RateLimitIndicator({ rateLimit }: RateLimitIndicatorProps) {
  const percentage = (rateLimit.remaining / rateLimit.limit) * 100;
  const isLow = percentage < 20;

  const now = new Date();
  const diffMs = rateLimit.resetAt.getTime() - now.getTime();
  const diffMin = Math.max(0, Math.ceil(diffMs / 1000 / 60));

  return (
    <div className="text-muted-foreground text-right text-xs">
      <div className="flex items-center justify-end gap-1.5">
        <span>
          <span className={isLow ? "text-amber-500" : ""}>
            {rateLimit.remaining}/{rateLimit.limit}
          </span>{" "}
          API requests remaining
        </span>
        <Link
          href="/how-it-works"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="How it works"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </Link>
      </div>
      {diffMin > 0 && <div className="mt-0.5">Resets in {diffMin} min</div>}
    </div>
  );
}
