import fs from "node:fs/promises";
import path from "node:path";

const UPLOAD_PREFIX = "/reports/uploads/";

export function isManagedUploadPublicPath(p: string | null | undefined): boolean {
  if (!p || typeof p !== "string") return false;
  return p.startsWith(UPLOAD_PREFIX);
}

function sanitizeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
  return base || "file.bin";
}

export function uploadPublicPath(reportId: string, originalName: string): string {
  const safeReport = reportId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) || "unknown";
  const fname = `${Date.now()}_${sanitizeFilename(originalName)}`;
  return `${UPLOAD_PREFIX}${safeReport}/${fname}`;
}

export function publicPathToAbsoluteDiskPath(publicUrlPath: string): string {
  const rel = publicUrlPath.startsWith("/") ? publicUrlPath.slice(1) : publicUrlPath;
  return path.join(process.cwd(), "public", rel);
}

export async function writeUploadedFile(
  publicUrlPath: string,
  data: Buffer,
): Promise<void> {
  const abs = publicPathToAbsoluteDiskPath(publicUrlPath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, data);
}

export async function tryDeletePublicFile(publicUrlPath: string | null): Promise<void> {
  if (!publicUrlPath || !isManagedUploadPublicPath(publicUrlPath)) return;
  try {
    await fs.unlink(publicPathToAbsoluteDiskPath(publicUrlPath));
  } catch {
    /* missing file is fine */
  }
}
