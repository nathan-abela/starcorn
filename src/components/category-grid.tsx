"use client";

import type { Category } from "@/lib/categories";

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryName: string) => void;
  totalRepos: number;
}

export function CategoryGrid({
  categories,
  selectedCategory,
  onCategorySelect,
  totalRepos,
}: CategoryGridProps) {
  const isAllSelected = selectedCategory === null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <button
        onClick={() => onCategorySelect("__all__")}
        className={`cursor-pointer rounded-lg border p-3 text-left transition-all ${
          isAllSelected
            ? "border-primary bg-primary/10 text-foreground"
            : "border-border/50 bg-background hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <div className="text-sm leading-tight font-medium">All</div>
        <div className={`mt-1 text-xs ${isAllSelected ? "text-primary" : "text-muted-foreground"}`}>
          {totalRepos} {totalRepos === 1 ? "repo" : "repos"}
        </div>
      </button>
      {categories.map((category) => {
        const isSelected = selectedCategory === category.name;
        const isEmpty = category.repos.length === 0;

        return (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            className={`cursor-pointer rounded-lg border p-3 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/10 text-foreground"
                : isEmpty
                  ? "border-border/30 bg-muted/20 text-muted-foreground hover:border-border/50"
                  : "border-border/50 bg-background hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <div className="text-sm leading-tight font-medium">{category.name}</div>
            <div
              className={`mt-1 text-xs ${isSelected ? "text-primary" : "text-muted-foreground"}`}
            >
              {category.repos.length} {category.repos.length === 1 ? "repo" : "repos"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
