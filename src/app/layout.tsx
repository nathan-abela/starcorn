import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "starcorn - GitHub Stars Organizer",
  description:
    "Organize and export your GitHub starred repositories. No authentication required, fully private, works instantly.",
  keywords: [
    "github stars",
    "github stars organizer",
    "export github stars",
    "organize starred repos",
  ],
  icons: {
    icon: [
      { url: "/assets/favicons/favicon.ico", sizes: "48x48" },
      { url: "/assets/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/assets/favicons/apple-touch-icon.png",
  },
  manifest: "/assets/favicons/site.webmanifest",
  openGraph: {
    title: "starcorn - GitHub Stars Organizer",
    description:
      "Organize and export your GitHub starred repositories. No authentication required.",
    type: "website",
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
