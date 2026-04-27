"use client";

import { useState } from "react";
import type { GitHubRepo } from "@/types";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { RepoCard } from "@/components/repo-card";

interface RepoDndProviderProps {
  children: React.ReactNode;
  /** Called when a repo is dropped on a category. */
  onMoveRepo: (repoFullName: string, targetCategory: string) => void;
}

/**
 * Drag-and-drop context provider for repo organization.
 *
 * Wraps `CategoryGrid` and `DroppableCategory` to enable dragging repos
 * between category tiles. Uses `dnd-kit` with mouse and touch sensors.
 *
 * @see https://dndkit.com/ for `dnd-kit` documentation
 */
export function RepoDndProvider({ children, onMoveRepo }: RepoDndProviderProps) {
  const [activeRepo, setActiveRepo] = useState<GitHubRepo | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  function handleDragStart(event: DragStartEvent) {
    const repo = event.active.data.current?.repo as GitHubRepo | undefined;
    if (repo) {
      setActiveRepo(repo);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveRepo(null);

    if (!over) return;

    const repoFullName = active.id as string;
    const targetCategory = over.id as string;

    onMoveRepo(repoFullName, targetCategory);
  }

  function handleDragCancel() {
    setActiveRepo(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeRepo ? (
          <div className="w-[320px] rotate-2 opacity-80 shadow-xl">
            <RepoCard repo={activeRepo} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
