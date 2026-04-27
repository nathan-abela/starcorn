"use client";

import type { GitHubRepo } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

import { RepoCard } from "@/components/repo-card";

interface DraggableRepoCardProps {
  repo: GitHubRepo;
}

/**
 * Draggable wrapper around `RepoCard`.
 *
 * Shows a grip handle on hover (right side) that users can drag to move
 * the repo to a different category. The original card becomes invisible
 * while dragging, and a `DragOverlay` (in `RepoDndProvider`) shows the preview.
 *
 * Must be used within a `RepoDndProvider` context.
 */
export function DraggableRepoCard({ repo }: DraggableRepoCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: repo.full_name,
    data: { repo },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/drag relative h-full ${isDragging ? "opacity-0" : ""}`}
    >
      <button
        {...listeners}
        {...attributes}
        className="bg-card ring-border absolute top-1/2 -right-2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-grab items-center justify-center rounded-md opacity-0 shadow-sm ring-1 transition-opacity group-hover/drag:opacity-100 active:cursor-grabbing"
        aria-label={`Drag ${repo.full_name} to another category`}
      >
        <GripVertical className="text-muted-foreground h-4 w-4" />
      </button>
      <RepoCard repo={repo} />
    </div>
  );
}
