"use client";

import { useState } from "react";
import type { GitHubRepo } from "@/types";
import { ChevronDown, Star } from "lucide-react";

import { formatNumber } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitHubIcon } from "@/components/icons";

interface RepoCardProps {
  repo: GitHubRepo;
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Markdown: "#083fa1",
};

export function RepoCard({ repo }: RepoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const languageColor = repo.language ? languageColors[repo.language] || "#6e7681" : null;

  return (
    <Card className="hover:border-muted-foreground/50 py-4 transition-all">
      <CardContent className="px-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={repo.owner.avatar_url} alt={`${repo.owner.login}'s avatar`} />
              <AvatarFallback>{repo.owner.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-card-foreground truncate font-medium">{repo.full_name}</h3>
                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                {repo.description || "No description"}
              </p>
            </div>
          </div>

          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-xs">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: languageColor || "#6e7681" }}
                />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {formatNumber(repo.stargazers_count)}
            </span>
          </div>

          {repo.topics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {repo.topics.slice(0, isExpanded ? undefined : 5).map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {!isExpanded && repo.topics.length > 5 && (
                <span className="text-muted-foreground text-xs">
                  +{repo.topics.length - 5} more
                </span>
              )}
            </div>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            {repo.description && (
              <p className="text-muted-foreground text-sm">{repo.description}</p>
            )}
            <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
              <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
              {repo.fork && (
                <Badge variant="outline" className="text-xs">
                  Fork
                </Badge>
              )}
            </div>
            <Button variant="secondary" size="sm" className="mt-3" asChild>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <GitHubIcon className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
