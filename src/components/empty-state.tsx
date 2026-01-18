"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  username: string;
}

export function EmptyState({ username }: EmptyStateProps) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/mascot/squirrel-sad.png"
          alt="Sad squirrel with empty chest"
          className="h-32 w-auto"
        />
        <div>
          <h3 className="text-lg font-medium">No stars yet!</h3>
          <p className="text-muted-foreground mt-1">
            @{username} has not starred any repositories.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Go explore GitHub and find some awesome projects!
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://github.com/nathan-abela/starcorn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Maybe start with this one? ⭐
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
