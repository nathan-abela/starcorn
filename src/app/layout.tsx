import type { Metadata } from "next";

import { basePath } from "@/lib/config";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "starcorn - GitHub Stars Organizer",
  description:
    "Organize and export your GitHub starred repositories. No authentication required, fully private, instant results. Export to Markdown, JSON, or CSV.",
  keywords: [
    "github stars",
    "github stars organizer",
    "export github stars",
    "organize starred repos",
    "github starred repositories",
    "github stars export",
    "github stars markdown",
    "github stars csv",
    "github stars json",
    "starred repos organizer",
  ],
  icons: {
    icon: [
      { url: `${basePath}/assets/favicons/favicon.ico`, sizes: "48x48" },
      { url: `${basePath}/assets/favicons/favicon-96x96.png`, sizes: "96x96", type: "image/png" },
    ],
    apple: `${basePath}/assets/favicons/apple-touch-icon.png`,
  },
  manifest: `${basePath}/assets/favicons/site.webmanifest`,
  openGraph: {
    title: "starcorn - GitHub Stars Organizer",
    description:
      "Organize and export your GitHub starred repositories. No authentication required, fully private, instant results.",
    type: "website",
    siteName: "starcorn",
  },
  twitter: {
    card: "summary",
    title: "starcorn - GitHub Stars Organizer",
    description: "Organize and export your GitHub starred repositories. No auth required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
