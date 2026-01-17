"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

import type { SortOption } from "@/lib/categories";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type { SortOption };

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function FilterControls({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}: FilterControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        onSearchChange("");
        inputRef.current?.blur();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSearchChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search repositories... (⌘K)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-9 pl-9"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Select value={sortOption} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stars-desc">Stars (High to Low)</SelectItem>
          <SelectItem value="stars-asc">Stars (Low to High)</SelectItem>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="updated-desc">Recently Updated</SelectItem>
          <SelectItem value="updated-asc">Least Recently Updated</SelectItem>
          <SelectItem value="language">Group by Language</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
