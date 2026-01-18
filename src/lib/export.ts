import type { Category } from "./categories";

export type ExportFormat = "markdown" | "json" | "csv";

interface ExportOptions {
  username: string;
  categories: Category[];
  totalRepos: number;
}

export function exportToMarkdown({ username, categories }: ExportOptions): string {
  const lines: string[] = [`# GitHub Stars - @${username}`, ""];

  for (const category of categories) {
    if (category.repos.length === 0) continue;

    lines.push(`## ${category.name} (${category.repos.length})`, "");

    for (const repo of category.repos) {
      const description = repo.description ? ` - ${repo.description}` : "";
      const stars = repo.stargazers_count.toLocaleString();
      lines.push(`- [${repo.full_name}](${repo.html_url})${description} - ⭐ ${stars}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

export function exportToJSON({ username, categories, totalRepos }: ExportOptions): string {
  const data = {
    username,
    exportedAt: new Date().toISOString(),
    totalStars: totalRepos,
    categories: Object.fromEntries(
      categories
        .filter((cat) => cat.repos.length > 0)
        .map((cat) => [
          cat.name,
          cat.repos.map((repo) => ({
            name: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language,
            topics: repo.topics,
          })),
        ])
    ),
  };

  return JSON.stringify(data, null, 2);
}

export function exportToCSV({ categories }: ExportOptions): string {
  const headers = ["Category", "Name", "Description", "URL", "Stars", "Language", "Topics"];
  const rows: string[][] = [headers];

  for (const category of categories) {
    for (const repo of category.repos) {
      rows.push([
        category.name,
        repo.full_name,
        repo.description || "",
        repo.html_url,
        repo.stargazers_count.toString(),
        repo.language || "",
        repo.topics.join("; "),
      ]);
    }
  }

  return rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function getExportContent(format: ExportFormat, options: ExportOptions): string {
  switch (format) {
    case "markdown":
      return exportToMarkdown(options);
    case "json":
      return exportToJSON(options);
    case "csv":
      return exportToCSV(options);
  }
}

export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case "markdown":
      return "md";
    case "json":
      return "json";
    case "csv":
      return "csv";
  }
}

export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
