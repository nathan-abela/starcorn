"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import { trackExportClicked } from "@/lib/analytics";
import type { Category } from "@/lib/categories";
import { downloadFile, getExportContent, getFileExtension, type ExportFormat } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  categories: Category[];
  totalRepos: number;
}

const PREVIEW_LINES = 20;

export function ExportModal({
  open,
  onOpenChange,
  username,
  categories,
  totalRepos,
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("markdown");
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => {
    return getExportContent(format, { username, categories, totalRepos });
  }, [format, username, categories, totalRepos]);

  const preview = useMemo(() => {
    const lines = content.split("\n");
    if (lines.length <= PREVIEW_LINES) return content;
    return lines.slice(0, PREVIEW_LINES).join("\n") + "\n...";
  }, [content]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    const formatKey = format === "markdown" ? "md" : format;
    trackExportClicked(formatKey as "md" | "json" | "csv");
  }, [content, format]);

  const handleDownload = useCallback(() => {
    const extension = getFileExtension(format);
    const filename = `${username}-stars.${extension}`;
    downloadFile(content, filename);
    const formatKey = format === "markdown" ? "md" : format;
    trackExportClicked(formatKey as "md" | "json" | "csv");
  }, [content, format, username]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Stars</DialogTitle>
        </DialogHeader>

        <Tabs value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="csv">CSV</TabsTrigger>
          </TabsList>

          <TabsContent value={format} className="mt-4">
            <div className="bg-muted/50 max-h-80 overflow-auto rounded-lg border p-4">
              <pre className="text-muted-foreground text-sm break-all whitespace-pre-wrap">
                <code>{preview}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCopy} className="cursor-pointer">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <Button onClick={handleDownload} className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
