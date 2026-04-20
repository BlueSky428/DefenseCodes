"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

function SourceChip({ custom }: { custom: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        custom
          ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
          : "border border-white/10 bg-white/[0.06] text-slate-400"
      }`}
    >
      {custom ? "Uploaded" : "Default"}
    </span>
  );
}

export function AdminReportsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIdRaw = searchParams.get("id");

  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<AdminReportRow[]>([]);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedRow =
    authed && selectedIdRaw && rows.some((r) => r.id === selectedIdRaw)
      ? (rows.find((r) => r.id === selectedIdRaw) ?? null)
      : null;

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
      setMessage("Loaded documents.");
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

  useEffect(() => {
    if (!authed || rows.length === 0 || !selectedIdRaw) return;
    if (!rows.some((r) => r.id === selectedIdRaw)) {
      router.replace("/admin");
    }
  }, [authed, rows, selectedIdRaw, router]);

  const persistSecret = useCallback((s: string) => {
    setSecret(s);
    try {
      if (s.trim()) sessionStorage.setItem("defense-codes-admin-secret", s.trim());
      else sessionStorage.removeItem("defense-codes-admin-secret");
    } catch {
      /* ignore */
    }
  }, []);

  const openDetail = (reportId: string) => {
    router.push(`/admin?id=${encodeURIComponent(reportId)}`);
  };

  const closeDetail = () => {
    router.replace("/admin");
  };

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
      setMessage("Price override cleared.");
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

  const rowBusy = (rowId: string) => Boolean(busyId?.startsWith(rowId));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold text-white">
            Admin · Documents
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Browse reports by name, attach or remove PDF / Word files from the list, or open a
            document for full details and pricing settings.
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
          Set <span className="font-mono">ADMIN_API_SECRET</span> on the server. Sent as{" "}
          <span className="font-mono">x-admin-secret</span> (stored in sessionStorage for this
          browser).
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

      {authed && rows.length > 0 && !selectedRow ? (
        <GlassPanel className="mt-8 overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-[family-name:var(--font-space)] text-lg font-semibold text-white">
              Documents
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {rows.length} report{rows.length === 1 ? "" : "s"}. Click a row for details and
              settings. Use + / − on the right to add or remove uploaded files without leaving the
              list.
            </p>
          </div>
          <ul className="divide-y divide-white/10">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-col sm:flex-row sm:items-stretch">
                <button
                  type="button"
                  onClick={() => openDetail(row.id)}
                  className="min-w-0 flex-1 px-5 py-4 text-left transition hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]/60"
                >
                  <div className="font-[family-name:var(--font-space)] text-base font-semibold text-white">
                    {row.title}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-500">{row.id}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      {row.sector}
                    </span>
                    <span className="text-xs text-slate-500">
                      {row.effectivePriceUsdt} USDT
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      PDF <SourceChip custom={Boolean(row.overridePdfPath)} />
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      Word <SourceChip custom={Boolean(row.overrideDocPath)} />
                    </span>
                  </div>
                </button>
                <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-white/10 px-4 py-3 sm:border-l sm:border-t-0 sm:px-3">
                  <label className="cursor-pointer rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/5">
                    + PDF
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      disabled={rowBusy(row.id)}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) void uploadFile(row.id, "pdf", f);
                      }}
                    />
                  </label>
                  <label className="cursor-pointer rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/5">
                    + Word
                    <input
                      type="file"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      disabled={rowBusy(row.id)}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) void uploadFile(row.id, "doc", f);
                      }}
                    />
                  </label>
                  {row.overridePdfPath ? (
                    <button
                      type="button"
                      disabled={busyId === `${row.id}-rm-pdf`}
                      onClick={() => void removeFile(row.id, "pdf")}
                      className="rounded-lg border border-rose-500/35 px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      − PDF
                    </button>
                  ) : null}
                  {row.overrideDocPath ? (
                    <button
                      type="button"
                      disabled={busyId === `${row.id}-rm-doc`}
                      onClick={() => void removeFile(row.id, "doc")}
                      className="rounded-lg border border-rose-500/35 px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      − Word
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </GlassPanel>
      ) : null}

      {authed && selectedRow ? (
        <div className="mt-8 space-y-6">
          <button
            type="button"
            onClick={closeDetail}
            className="text-sm text-slate-400 transition hover:text-[var(--accent)]"
          >
            ← All documents
          </button>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlassPanel className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                Document details
              </h2>
              <h3 className="mt-3 font-[family-name:var(--font-space)] text-xl font-semibold text-white">
                {selectedRow.title}
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Report id</dt>
                  <dd className="mt-0.5 font-mono text-xs text-slate-300">{selectedRow.id}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Slug</dt>
                  <dd className="mt-0.5 font-mono text-xs text-slate-300">{selectedRow.slug}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Sector</dt>
                  <dd className="mt-0.5 text-slate-200">{selectedRow.sector}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Effective price</dt>
                  <dd className="mt-0.5 text-lg font-semibold text-white">
                    {selectedRow.effectivePriceUsdt}{" "}
                    <span className="text-sm font-normal text-slate-500">USDT</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">PDF (effective)</dt>
                  <dd className="mt-0.5 break-all font-mono text-[11px] text-slate-400">
                    {selectedRow.effectivePdfPath}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Word (effective)</dt>
                  <dd className="mt-0.5 break-all font-mono text-[11px] text-slate-400">
                    {selectedRow.effectiveDocPath}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Code defaults</dt>
                  <dd className="mt-1 space-y-1 break-all font-mono text-[10px] leading-relaxed text-slate-500">
                    <div>PDF: {selectedRow.defaultPdfPath}</div>
                    <div>Word: {selectedRow.defaultDocPath}</div>
                    <div>Price: {selectedRow.defaultPriceUsdt} USDT</div>
                  </dd>
                </div>
              </dl>
              <Link
                href={`/report/${selectedRow.slug}`}
                className="mt-6 inline-flex text-sm text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Open public report page →
              </Link>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                Settings
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Override catalog price and deliverable files for this document. Uploads replace
                any previous uploaded file of the same type.
              </p>

              <section className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Price (USDT)
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  DB override:{" "}
                  {selectedRow.overridePriceUsdt === null ? "none" : selectedRow.overridePriceUsdt}{" "}
                  · Code default: {selectedRow.defaultPriceUsdt}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={priceDraft[selectedRow.id] ?? ""}
                    onChange={(e) =>
                      setPriceDraft((d) => ({ ...d, [selectedRow.id]: e.target.value }))
                    }
                    className="w-36 rounded-lg border border-white/15 bg-[#070b18] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[var(--accent)]/50"
                  />
                  <button
                    type="button"
                    disabled={busyId === selectedRow.id}
                    onClick={() => void savePrice(selectedRow.id)}
                    className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:opacity-50"
                  >
                    Save price
                  </button>
                  <button
                    type="button"
                    disabled={busyId === selectedRow.id}
                    onClick={() => void revertPrice(selectedRow.id)}
                    className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                  >
                    Revert price
                  </button>
                </div>
              </section>

              <section className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  PDF deliverable
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SourceChip custom={Boolean(selectedRow.overridePdfPath)} />
                  <label className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5">
                    Upload PDF
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      disabled={rowBusy(selectedRow.id)}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) void uploadFile(selectedRow.id, "pdf", f);
                      }}
                    />
                  </label>
                  {selectedRow.overridePdfPath ? (
                    <button
                      type="button"
                      disabled={busyId === `${selectedRow.id}-rm-pdf`}
                      onClick={() => void removeFile(selectedRow.id, "pdf")}
                      className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      Remove upload
                    </button>
                  ) : null}
                </div>
              </section>

              <section className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Word deliverable
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SourceChip custom={Boolean(selectedRow.overrideDocPath)} />
                  <label className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5">
                    Upload .doc / .docx
                    <input
                      type="file"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      disabled={rowBusy(selectedRow.id)}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) void uploadFile(selectedRow.id, "doc", f);
                      }}
                    />
                  </label>
                  {selectedRow.overrideDocPath ? (
                    <button
                      type="button"
                      disabled={busyId === `${selectedRow.id}-rm-doc`}
                      onClick={() => void removeFile(selectedRow.id, "doc")}
                      className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      Remove upload
                    </button>
                  ) : null}
                </div>
              </section>
            </GlassPanel>
          </div>
        </div>
      ) : null}
    </div>
  );
}
