import posthog from "posthog-js";

/**
 * Track when stars are successfully fetched.
 * Only captures the count, never the username (privacy).
 */
export function trackStarsFetched(count: number) {
  posthog.capture("stars_fetched", { count });
}

/**
 * Track when user clicks export.
 * Captures the format chosen (md, json, csv).
 */
export function trackExportClicked(format: "md" | "json" | "csv") {
  posthog.capture("export_clicked", { format });
}
