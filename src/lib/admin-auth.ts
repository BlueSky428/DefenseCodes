import type { NextRequest } from "next/server";

/** Server-only. Admin routes expect `x-admin-secret` matching this env var. */
export function adminSecretConfigured(): boolean {
  return Boolean(process.env.ADMIN_API_SECRET?.trim());
}

export function verifyAdminRequest(req: NextRequest): boolean {
  const want = process.env.ADMIN_API_SECRET?.trim();
  if (!want) return false;
  const got = req.headers.get("x-admin-secret")?.trim();
  return Boolean(got && got === want);
}
