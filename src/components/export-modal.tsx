"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import { trackExportClicked } from "@/lib/analytics";
import type { Category } from "@/lib/categories";
import { downloadFile, getExportContent, getFileExtension, type ExportFormat } from "@/lib/export";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [selectedCategory, setSelectedCategory] = useState<string>("__all__");

  const categoriesWithRepos = useMemo(
    () => categories.filter((c) => c.repos.length > 0),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    if (selectedCategory === "__all__") return categories;
    return categories.filter((c) => c.name === selectedCategory);
  }, [categories, selectedCategory]);

  const filteredRepoCount = useMemo(() => {
    return filteredCategories.reduce((sum, c) => sum + c.repos.length, 0);
  }, [filteredCategories]);

  const content = useMemo(() => {
    return getExportContent(format, {
      username,
      categories: filteredCategories,
      totalRepos: filteredRepoCount,
    });
  }, [format, username, filteredCategories, filteredRepoCount]);

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
    const categorySlug =
      selectedCategory === "__all__"
        ? ""
        : `-${selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const filename = `${username}-stars${categorySlug}.${extension}`;
    downloadFile(content, filename);
    const formatKey = format === "markdown" ? "md" : format;
    trackExportClicked(formatKey as "md" | "json" | "csv");
  }, [content, format, username, selectedCategory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Stars</DialogTitle>
          <DialogDescription>
            Download or copy your organized stars in your preferred format.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">Category:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All ({totalRepos})</SelectItem>
              {categoriesWithRepos.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name} ({cat.repos.length})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
