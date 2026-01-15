"use client";

import type { GitHubRepo } from "@/types";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <Alert className="mb-4 border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">{partialMessage}</AlertDescription>
        </Alert>
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
