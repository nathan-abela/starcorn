import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe, Key, Lock, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works - starcorn",
  description:
    "Learn how starcorn fetches and organizes your GitHub stars directly from your browser with full privacy.",
};

export default function HowItWorks() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-8 cursor-pointer">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="mb-8 text-4xl font-bold tracking-tight">How It Works</h1>

        <div className="space-y-12">
          <Section icon={<Globe className="h-5 w-5" />} title="Direct Browser Fetching">
            <p>
              When you enter a username, your browser fetches data directly from GitHub&apos;s API.
              No data passes through our servers. We don&apos;t have servers. This is a fully static
              site.
            </p>
            <p>
              This means your starred repositories never leaves your browser until you choose to
              export them.
            </p>
          </Section>

          <Section icon={<Zap className="h-5 w-5" />} title="Rate Limits">
            <p>
              GitHub limits API requests to prevent abuse. These limits apply to{" "}
              <strong>your IP address</strong>, not to this website.
            </p>
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Without a token</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>60 requests per hour</li>
                <li>30 stars per request</li>
                <li>≈ 1,800 stars maximum per hour</li>
              </ul>

              <h4 className="mt-6 mb-3 font-medium">With a personal access token</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>5,000 requests per hour</li>
                <li>30 stars per request</li>
                <li>≈ 150,000 stars maximum per hour</li>
              </ul>
            </div>
            <p className="text-muted-foreground text-sm">
              Rate limits reset on a rolling hourly window. If you run out, wait a few minutes or
              add a token.
            </p>
          </Section>

          <Section icon={<Key className="h-5 w-5" />} title="Token Safety">
            <p>
              If you have more than 500 stars or want higher rate limits, you can provide a GitHub
              personal access token.
            </p>
            <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
              <li>
                Your token is <strong>never stored</strong>. Not in cookies, localStorage, or
                anywhere else
              </li>
              <li>It stays in memory only and is cleared when you close the tab</li>
              <li>
                It&apos;s sent directly to GitHub&apos;s API from your browser, never through any
                third party
              </li>
              <li>
                You can create a token with no permissions (public access only) at{" "}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/settings/tokens
                </a>
              </li>
            </ul>
          </Section>

          <Section icon={<Lock className="h-5 w-5" />} title="Privacy First">
            <p>starcorn is designed with privacy as a core principle:</p>
            <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
              <li>No accounts or authentication required</li>
              <li>No data stored between sessions (refresh = start over)</li>
              <li>No analytics that track your GitHub activity</li>
              <li>
                Open source. You can verify everything at{" "}
                <a
                  href="https://github.com/nathan-abela/starcorn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </Section>
        </div>

        <div className="mt-16 border-t pt-8">
          <p className="text-muted-foreground text-center text-sm">
            Still have questions?{" "}
            <a
              href="https://github.com/nathan-abela/starcorn/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open an issue on GitHub
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-foreground/90 space-y-4 pl-12">{children}</div>
    </section>
  );
}
