"use client";

import { getAssetPath } from "@/lib/config";
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
          src={getAssetPath("/assets/mascot/squirrel-sad.png")}
          alt="Sad squirrel with empty chest"
          className="h-32 w-auto"
        />
        <div>
          <h3 className="mt-2 text-lg font-medium">No stars yet!</h3>
          <p className="text-muted-foreground mt-2">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              @{username}
            </a>{" "}
            has not starred any repositories.
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
