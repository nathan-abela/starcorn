"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function PostHogProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  useEffect(() => {
    if (IS_PRODUCTION && POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        defaults: "2025-11-30",
      });
    }
  }, []);

  if (!IS_PRODUCTION || !POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
