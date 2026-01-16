"use client";

import type { GitHubRepo } from "@/types";
import { AlertTriangle } from "lucide-react";

import { RepoCard } from "./repo-card";

interface RepoListProps {
  repos: GitHubRepo[];
  isPartial?: boolean;
  partialMessage?: string;
}

export function RepoList({ repos, isPartial, partialMessage }: RepoListProps) {
  return (
    <div className="w-full">
      {isPartial && partialMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
          <span>{partialMessage}</span>
        </div>
      )}
      <div className="text-muted-foreground mb-4 text-sm">
        {repos.length} {repos.length === 1 ? "repository" : "repositories"}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}
