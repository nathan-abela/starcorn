"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { GitHubIcon } from "@/components/icons";

const GITHUB_REPO = "nathan-abela/starcorn";
const CACHE_KEY = "starcorn-github-stars";
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const SHOW_STAR_COUNT = false; // TODO: Enable when applicable

function formatStars(count: number): string {
  return Intl.NumberFormat("en", { notation: "compact" }).format(count).toLowerCase();
}

export function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    if (!SHOW_STAR_COUNT) return;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { count, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setStars(count);
        return;
      }
    }

    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ count: data.stargazers_count, timestamp: Date.now() })
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={`https://github.com/${GITHUB_REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border/50 bg-background/50 text-muted-foreground hover:border-primary/50 hover:text-primary inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-2 transition-colors"
    >
      <GitHubIcon className="h-4 w-4" />

      {SHOW_STAR_COUNT && stars !== null && (
        <span className="flex items-center gap-1 text-xs tabular-nums">
          <Star className="h-3 w-3" />
          {formatStars(stars)}
        </span>
      )}
    </a>
  );
}
