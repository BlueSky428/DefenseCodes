"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GlassPanel } from "@/components/glass-panel";

type AdminReportRow = {
  id: string;
  slug: string;
  title: string;
  sector: string;
  defaultPriceUsdt: number;
  effectivePriceUsdt: number;
  defaultDocPath: string;
  defaultPdfPath: string;
  overridePriceUsdt: number | null;
  overrideDocPath: string | null;
  overridePdfPath: string | null;
  effectiveDocPath: string;
  effectivePdfPath: string;
};

function headers(secret: string): HeadersInit {
  return { "x-admin-secret": secret.trim() };
}

export function AdminReportsPanel() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<AdminReportRow[]>([]);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!secret.trim()) {
      setError("Enter the admin secret first.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const r = await fetch("/api/admin/reports", { headers: headers(secret) });
      const data = (await r.json()) as { reports?: AdminReportRow[]; error?: string };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      const list = data.reports ?? [];
      setRows(list);
      const drafts: Record<string, string> = {};
      for (const row of list) {
        drafts[row.id] = String(row.effectivePriceUsdt);
      }
      setPriceDraft(drafts);
      setAuthed(true);
      setMessage("Loaded reports.");
    } catch (e) {
      setAuthed(false);
      setRows([]);
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const s = sessionStorage.getItem("defense-codes-admin-secret");
      if (s) setSecret(s);
    } catch {
      /* ignore */
    }
  }, []);

  const persistSecret = useCallback((s: string) => {
    setSecret(s);
    try {
      if (s.trim()) sessionStorage.setItem("defense-codes-admin-secret", s.trim());
      else sessionStorage.removeItem("defense-codes-admin-secret");
    } catch {
      /* ignore */
    }
  }, []);

  const savePrice = async (reportId: string) => {
    const raw = priceDraft[reportId]?.trim();
    if (raw === undefined || raw === "") {
      setError("Price cannot be empty. Use “Revert price” to clear the override.");
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) {
      setError("Enter a valid non-negative price.");
      return;
    }
    setBusyId(reportId);
    setError(null);
    setMessage(null);
    try {
      const r = await fetch(`/api/admin/reports/${reportId}/price`, {
        method: "PATCH",
        headers: { ...headers(secret), "Content-Type": "application/json" },
        body: JSON.stringify({ priceUsdt: n }),
      });
      const data = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setMessage("Price saved.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusyId(null);
    }
  };

  const revertPrice = async (reportId: string) => {
    setBusyId(reportId);
    setError(null);
    setMessage(null);
    try {
      const r = await fetch(`/api/admin/reports/${reportId}/price`, {
        method: "PATCH",
        headers: { ...headers(secret), "Content-Type": "application/json" },
        body: JSON.stringify({ priceUsdt: null }),
      });
      const data = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setMessage("Price override cleared (defaults from code apply).");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Revert failed");
    } finally {
      setBusyId(null);
    }
  };

  const uploadFile = async (reportId: string, kind: "pdf" | "doc", file: File) => {
    setBusyId(`${reportId}-${kind}`);
    setError(null);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("kind", kind);
      fd.append("file", file);
      const r = await fetch(`/api/admin/reports/${reportId}/upload`, {
        method: "POST",
        headers: headers(secret),
        body: fd,
      });
      const data = (await r.json()) as { error?: string; publicPath?: string };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setMessage(`Uploaded ${kind.toUpperCase()} → ${data.publicPath ?? "ok"}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusyId(null);
    }
  };

  const removeFile = async (reportId: string, kind: "pdf" | "doc") => {
    setBusyId(`${reportId}-rm-${kind}`);
    setError(null);
    setMessage(null);
    try {
      const r = await fetch(`/api/admin/reports/${reportId}/file?kind=${kind}`, {
        method: "DELETE",
        headers: headers(secret),
      });
      const data = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setMessage(`${kind.toUpperCase()} override removed.`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold text-white">
            Admin · Reports
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Set per-report USDT price overrides and upload PDF / Word deliverables. Files are stored
            under <span className="font-mono text-slate-300">public/reports/uploads/</span> (fine
            for local/VPS; use object storage for read-only serverless hosts).
          </p>
        </div>
        <Link
          href="/reports"
          className="text-sm text-slate-500 transition hover:text-[var(--accent)]"
        >
          ← Reports
        </Link>
      </div>

      <GlassPanel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
          Access
        </h2>
        <p className="mt-2 text-xs text-slate-500">
          Set <span className="font-mono">ADMIN_API_SECRET</span> in the server environment. This
          value is sent as the <span className="font-mono">x-admin-secret</span> header (stored in
          sessionStorage for this browser only).
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="password"
            autoComplete="off"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => persistSecret(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#070b18] px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-[var(--accent)]/50 sm:max-w-md"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void load()}
            className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#0A0F1F] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load / refresh"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="mt-3 text-sm text-emerald-400">{message}</p> : null}
      </GlassPanel>

      {authed && rows.length > 0 ? (
        <ul className="mt-8 space-y-6">
          {rows.map((row) => (
            <li key={row.id}>
              <GlassPanel className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--accent)]">
                      {row.sector}
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-space)] text-lg font-semibold text-white">
                      {row.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-slate-500">
                      id={row.id} · slug={row.slug}
                    </p>
                  </div>
                  <Link
                    href={`/report/${row.slug}`}
                    className="text-sm text-[var(--accent)] underline-offset-2 hover:underline"
                  >
                    View report page
                  </Link>
                </div>

                <div className="mt-6 grid gap-6 border-t border-white/10 pt-6 lg:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Price (USDT)
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Code default: {row.defaultPriceUsdt}. Override in DB:{" "}
                      {row.overridePriceUsdt === null ? "none" : row.overridePriceUsdt}.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={priceDraft[row.id] ?? ""}
                        onChange={(e) =>
                          setPriceDraft((d) => ({ ...d, [row.id]: e.target.value }))
                        }
                        className="w-32 rounded-lg border border-white/15 bg-[#070b18] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[var(--accent)]/50"
                      />
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void savePrice(row.id)}
                        className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void revertPrice(row.id)}
                        className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                      >
                        Revert price
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        PDF
                      </h4>
                      <p className="mt-1 break-all font-mono text-xs text-slate-500">
                        Effective: {row.effectivePdfPath}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="inline-flex cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5">
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            disabled={busyId?.startsWith(row.id) ?? false}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              e.target.value = "";
                              if (f) void uploadFile(row.id, "pdf", f);
                            }}
                          />
                          Upload PDF
                        </label>
                        {row.overridePdfPath ? (
                          <button
                            type="button"
                            disabled={busyId === `${row.id}-rm-pdf`}
                            onClick={() => void removeFile(row.id, "pdf")}
                            className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                          >
                            Remove override
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Word
                      </h4>
                      <p className="mt-1 break-all font-mono text-xs text-slate-500">
                        Effective: {row.effectiveDocPath}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="inline-flex cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5">
                          <input
                            type="file"
                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="hidden"
                            disabled={busyId?.startsWith(row.id) ?? false}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              e.target.value = "";
                              if (f) void uploadFile(row.id, "doc", f);
                            }}
                          />
                          Upload .doc/.docx
                        </label>
                        {row.overrideDocPath ? (
                          <button
                            type="button"
                            disabled={busyId === `${row.id}-rm-doc`}
                            onClick={() => void removeFile(row.id, "doc")}
                            className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                          >
                            Remove override
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
