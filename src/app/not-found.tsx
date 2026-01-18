import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-4">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/mascot/squirrel-dizzy.png"
            alt="Dizzy squirrel with stars"
            className="h-48 w-auto"
          />

          <div className="space-y-2">
            <h1 className="text-7xl font-bold tracking-tight">404</h1>
            <h2 className="text-muted-foreground text-xl">Page not found</h2>
          </div>

          <p className="text-muted-foreground max-w-md">
            Looks like this page got lost in the stars. Let&apos;s get you back to organizing your
            starred repos.
          </p>

          <Button asChild className="mt-2 cursor-pointer">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
