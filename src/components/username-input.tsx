"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Star } from "lucide-react";

import { validateUsername } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitHubIcon } from "@/components/icons";

interface UsernameInputProps {
  onSubmit: (username: string) => void;
  isLoading: boolean;
}

export function UsernameInput({ onSubmit, isLoading }: UsernameInputProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onSubmit(username.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 flex -translate-y-1/2 items-center gap-1">
              <GitHubIcon className="h-4 w-4" />
            </div>
            <Input
              type="text"
              value={username}
              onChange={handleChange}
              placeholder="Enter GitHub username"
              disabled={isLoading}
              className="h-12 pl-10 text-base"
              aria-invalid={!!error}
            />
          </div>
          <Button type="submit" disabled={isLoading || !username.trim()} className="h-12 px-6">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Fetch Stars
              </>
            )}
          </Button>
        </div>
        {error && (
          <p className="text-destructive flex items-center gap-1.5 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
