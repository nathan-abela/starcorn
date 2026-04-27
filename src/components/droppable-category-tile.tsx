"use client";

import { useDroppable } from "@dnd-kit/core";

import type { Category } from "@/lib/categories";

interface DroppableCategoryTileProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Category tile in the grid that accepts dropped repos.
 *
 * Used in `CategoryGrid`. When a `DraggableRepoCard` is dragged over this tile,
 * it highlights to indicate it's a valid drop target. Dropping triggers
 * the `onMoveRepo` callback in `RepoDndProvider`.
 *
 * Must be used within a `RepoDndProvider` context.
 */
export function DroppableCategoryTile({
  category,
  isSelected,
  onSelect,
}: DroppableCategoryTileProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.name,
    data: { categoryName: category.name },
  });

  const isEmpty = category.repos.length === 0;

  return (
    <button
      ref={setNodeRef}
      onClick={onSelect}
      className={`cursor-pointer rounded-lg border p-3 text-left transition-all ${
        isOver
          ? "border-primary bg-primary/20 ring-primary/50 ring-2"
          : isSelected
            ? "border-primary bg-primary/10 text-foreground"
            : isEmpty
              ? "border-border/30 bg-muted/20 text-muted-foreground hover:border-border/50"
              : "border-border/50 bg-background hover:border-primary/50 hover:bg-muted/30"
      }`}
    >
      <div className="text-sm leading-tight font-medium">{category.name}</div>
      <div className={`mt-1 text-xs ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
        {category.repos.length} {category.repos.length === 1 ? "repo" : "repos"}
        {isOver && " (drop here)"}
      </div>
    </button>
  );
}
