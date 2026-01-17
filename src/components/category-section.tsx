"use client";

import { forwardRef } from "react";

import type { Category } from "@/lib/categories";
import { RepoCard } from "@/components/repo-card";

interface CategorySectionProps {
  category: Category;
}

export const CategorySection = forwardRef<HTMLDivElement, CategorySectionProps>(
  function CategorySection({ category }, ref) {
    if (category.repos.length === 0) {
      return (
        <div ref={ref} className="py-8 text-center">
          <p className="text-muted-foreground">
            No repositories in <span className="font-medium">{category.name}</span>
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Drag repos here to organize them manually
          </p>
        </div>
      );
    }

    return (
      <div ref={ref}>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">{category.name}</h2>
          <span className="text-muted-foreground text-sm">
            {category.repos.length} {category.repos.length === 1 ? "repository" : "repositories"}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div>
    );
  }
);
