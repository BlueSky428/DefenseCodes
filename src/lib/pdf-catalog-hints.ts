type PdfInfoSnapshot = {
  info?: unknown;
  outline?: Array<{ title?: string }> | null;
  total: number;
};

function pickInfoString(info: Record<string, unknown> | null | undefined, keys: string[]): string | null {
  if (!info) return null;
  for (const key of keys) {
    const v = info[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function cleanBodyText(raw: string): string {
  return raw.replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();
}

function meaningfulLines(text: string, max = 12): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(
      (l) =>
        l.length > 3 &&
        !/^page\s+\d+(\s+of\s+\d+)?$/i.test(l) &&
        !/^--\s*\d+\s+of\s*\d+\s*--$/i.test(l),
    )
    .slice(0, max);
}

/**
 * Derive form hints from pdf-parse `getInfo()` + `getText()` output.
 */
export function hintsFromPdfContent(
  infoResult: PdfInfoSnapshot,
  fullText: string,
  fileName: string,
): {
  title: string;
  author: string;
  riskHighlight: string;
  summary: string;
  methodology: string;
  pageCount: number;
} {
  const info = (infoResult.info ?? null) as Record<string, unknown> | null | undefined;
  const metaTitle = pickInfoString(info, ["Title", "title"]);
  const metaAuthor = pickInfoString(info, ["Author", "author", "Creator", "creator"]);
  const metaSubject = pickInfoString(info, ["Subject", "subject"]);

  const text = cleanBodyText(fullText);
  const lines = meaningfulLines(text, 20);
  const firstLine = lines[0] ?? "";

  const outlineTitle = infoResult.outline?.[0]?.title?.trim();

  const title =
    metaTitle ||
    outlineTitle ||
    (firstLine.length > 6 && firstLine.length < 180 ? firstLine : "") ||
    fileName.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim() ||
    "Untitled report";

  const author = metaAuthor || "";

  const riskHighlight =
    metaSubject ||
    (firstLine && firstLine !== title ? firstLine.slice(0, 220) : lines[1]?.slice(0, 220) || "") ||
    "Risk summary to be edited after import.";

  const summaryChunk = text.length > 400 ? `${text.slice(0, 1200).trim()}…` : text;
  const summary =
    summaryChunk.length > 40
      ? summaryChunk.slice(0, 2500)
      : "Executive summary to be completed after import.";

  const methodology =
    text.length > 80
      ? `Imported from PDF. Excerpt: ${text.slice(0, 600).trim()}${text.length > 600 ? "…" : ""}`
      : "Methodology to be completed after import.";

  const pageCount = Math.max(1, infoResult.total || 1);

  return {
    title: title.slice(0, 300),
    author: author.slice(0, 200),
    riskHighlight: riskHighlight.slice(0, 400),
    summary: summary.slice(0, 4000),
    methodology: methodology.slice(0, 2000),
    pageCount,
  };
}
