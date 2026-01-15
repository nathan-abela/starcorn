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
    icon: "/favicon.svg",
  },
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
