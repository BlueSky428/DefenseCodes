"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GlassPanel } from "@/components/glass-panel";
import { ModalPortal } from "@/components/modal-portal";
import type { ReportSector } from "@/data/reports";

type AdminReportRow = {
  id: string;
  slug: string;
  title: string;
  sector: string;
  source: "builtin" | "dynamic";
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

type HiddenBuiltinRow = { id: string; title: string; slug: string; sector: string };

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

type AddForm = {
  slug: string;
  title: string;
  sector: ReportSector;
  date: string;
  riskHighlight: string;
  summary: string;
  author: string;
  version: string;
  classification: string;
  methodology: string;
  pageCount: string;
  priceUsdt: string;
};

const emptyAddForm: AddForm = {
  slug: "",
  title: "",
  sector: "Defense",
  date: "",
  riskHighlight: "",
  summary: "",
  author: "",
  version: "v1",
  classification: "COMMERCIAL IN CONFIDENCE",
  methodology: "",
  pageCount: "24",
  priceUsdt: "1",
};

function AddReportModal({
  open,
  secret,
  onClose,
  onCreated,
}: {
  open: boolean;
  secret: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<AddForm>(emptyAddForm);
  const [saving, setSaving] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(emptyAddForm);
      setLocalErr(null);
    }
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    setLocalErr(null);
    setSaving(true);
    try {
      const pageCount = Number(form.pageCount);
      const priceUsdt = Number(form.priceUsdt);
      const r = await fetch("/api/admin/reports/catalog", {
        method: "POST",
        headers: { ...headers(secret), "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug,
          title: form.title,
          sector: form.sector,
          date: form.date || undefined,
          riskHighlight: form.riskHighlight || undefined,
          summary: form.summary || undefined,
          author: form.author || undefined,
          version: form.version || undefined,
          classification: form.classification || undefined,
          methodology: form.methodology || undefined,
          pageCount: Number.isInteger(pageCount) && pageCount > 0 ? pageCount : undefined,
          priceUsdt: Number.isFinite(priceUsdt) && priceUsdt >= 0 ? priceUsdt : undefined,
        }),
      });
      const data = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      onCreated();
      onClose();
    } catch (e) {
      setLocalErr(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const field =
    "mb-4 block text-xs font-medium uppercase tracking-wide text-slate-400";
  const input =
    "mt-1.5 w-full rounded-lg border border-white/12 bg-[#070b18] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[var(--accent)]/45";

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[220] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-report-title"
        onClick={onClose}
      >
        <GlassPanel className="relative max-h-[min(90dvh,44rem)] w-full max-w-lg overflow-y-auto p-6 shadow-2xl">
          <div onClick={(e) => e.stopPropagation()}>
          <h2
            id="add-report-title"
            className="font-[family-name:var(--font-space)] text-xl font-semibold text-white"
          >
            New catalog report
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Creates a database-backed report (id = slug). Upload PDF/Word from the list or detail
            view after saving.
          </p>
          <div className="mt-6 space-y-1">
            <label className={field}>
              Slug <span className="text-rose-400">*</span>
              <input
                className={input}
                placeholder="e.g. hypersonic-supply-2027"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </label>
            <label className={field}>
              Title <span className="text-rose-400">*</span>
              <input
                className={input}
                placeholder="Report title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </label>
            <label className={field}>
              Sector
              <select
                className={input}
                value={form.sector}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sector: e.target.value as ReportSector }))
                }
              >
                <option value="Space">Space</option>
                <option value="Defense">Defense</option>
                <option value="Aerospace">Aerospace</option>
              </select>
            </label>
            <label className={field}>
              Date
              <input
                className={input}
                placeholder="e.g. April 2026"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </label>
            <label className={field}>
              Risk highlight
              <textarea
                className={`${input} min-h-[4rem] resize-y`}
                placeholder="One-line risk headline"
                value={form.riskHighlight}
                onChange={(e) => setForm((f) => ({ ...f, riskHighlight: e.target.value }))}
              />
            </label>
            <label className={field}>
              Executive summary (first paragraph)
              <textarea
                className={`${input} min-h-[5rem] resize-y`}
                placeholder="Shown as the first executive-summary block"
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={field}>
                Page count
                <input
                  className={input}
                  inputMode="numeric"
                  value={form.pageCount}
                  onChange={(e) => setForm((f) => ({ ...f, pageCount: e.target.value }))}
                />
              </label>
              <label className={field}>
                Price (USDT)
                <input
                  className={input}
                  inputMode="decimal"
                  value={form.priceUsdt}
                  onChange={(e) => setForm((f) => ({ ...f, priceUsdt: e.target.value }))}
                />
              </label>
            </div>
            <label className={field}>
              Author
              <input className={input} value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            </label>
            <label className={field}>
              Methodology (short)
              <textarea
                className={`${input} min-h-[3.5rem] resize-y`}
                value={form.methodology}
                onChange={(e) => setForm((f) => ({ ...f, methodology: e.target.value }))}
              />
            </label>
          </div>
          {localErr ? <p className="mt-4 text-sm text-rose-400">{localErr}</p> : null}
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving || !form.slug.trim() || !form.title.trim()}
              onClick={() => void submit()}
              className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#0A0F1F] transition hover:brightness-110 disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create report"}
            </button>
          </div>
          </div>
        </GlassPanel>
      </div>
    </ModalPortal>
  );
}

export function AdminReportsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIdRaw = searchParams.get("id");

  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<AdminReportRow[]>([]);
  const [hiddenBuiltins, setHiddenBuiltins] = useState<HiddenBuiltinRow[]>([]);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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
      const data = (await r.json()) as {
        reports?: AdminReportRow[];
        hiddenBuiltins?: HiddenBuiltinRow[];
        error?: string;
      };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      const list = data.reports ?? [];
      setRows(list);
      setHiddenBuiltins(data.hiddenBuiltins ?? []);
      const drafts: Record<string, string> = {};
      for (const row of list) {
        drafts[row.id] = String(row.effectivePriceUsdt);
      }
      setPriceDraft(drafts);
      setAuthed(true);
      setMessage("Catalog loaded.");
    } catch (e) {
      setAuthed(false);
      setRows([]);
      setHiddenBuiltins([]);
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

  const removeFromCatalog = async (row: AdminReportRow) => {
    const verb =
      row.source === "dynamic"
        ? "Permanently delete this catalog report?"
        : "Hide this built-in report from the public catalog? (You can restore it below.)";
    if (!confirm(`${verb}\n\n${row.title}`)) return;
    setBusyId(`rm-${row.id}`);
    setError(null);
    setMessage(null);
    try {
      const r = await fetch(`/api/admin/reports/catalog/${encodeURIComponent(row.id)}`, {
        method: "DELETE",
        headers: headers(secret),
      });
      const data = (await r.json()) as { error?: string; mode?: string };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setMessage(data.mode === "deleted" ? "Report deleted." : "Built-in hidden from catalog.");
      if (selectedIdRaw === row.id) closeDetail();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed");
    } finally {
      setBusyId(null);
    }
  };

  const restoreBuiltin = async (id: string) => {
    setBusyId(`restore-${id}`);
    setError(null);
    setMessage(null);
    try {
      const r = await fetch(`/api/admin/reports/catalog/${encodeURIComponent(id)}/restore`, {
        method: "POST",
        headers: headers(secret),
      });
      const data = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setMessage("Built-in report restored to catalog.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed");
    } finally {
      setBusyId(null);
    }
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Operations
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-space)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Document catalog
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Manage built-in and database reports, pricing overrides, and deliverables. Add new
            reports to the catalog or remove them (built-ins are hidden, not deleted from code).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {authed ? (
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/20"
            >
              + New report
            </button>
          ) : null}
          <Link
            href="/reports"
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-300 transition hover:border-white/25 hover:bg-white/5"
          >
            Public library
          </Link>
        </div>
      </div>

      <GlassPanel className="border border-white/[0.08] p-6 shadow-[0_0_0_1px_rgba(0,229,255,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
              Authenticate
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500">
              Server env <span className="font-mono text-slate-400">ADMIN_API_SECRET</span>. Header{" "}
              <span className="font-mono text-slate-400">x-admin-secret</span> — stored in
              sessionStorage for this browser only.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="password"
            autoComplete="off"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => persistSecret(e.target.value)}
            className="w-full rounded-xl border border-white/12 bg-[#070b18] px-4 py-3 font-mono text-sm text-white shadow-inner outline-none transition focus:border-[var(--accent)]/50 sm:max-w-md"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void load()}
            className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#0A0F1F] shadow-[0_0_24px_rgba(0,229,255,0.2)] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load catalog"}
          </button>
        </div>
        {error ? (
          <p className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {message}
          </p>
        ) : null}
      </GlassPanel>

      <AddReportModal
        open={addOpen}
        secret={secret}
        onClose={() => setAddOpen(false)}
        onCreated={() => void load()}
      />

      {authed && rows.length > 0 && !selectedRow ? (
        <>
          <GlassPanel className="mt-8 overflow-hidden border border-white/[0.08] p-0 shadow-[0_0_0_1px_rgba(0,229,255,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <div>
                <h2 className="font-[family-name:var(--font-space)] text-lg font-semibold text-white">
                  Active documents
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {rows.length} in catalog · click a row for details ·{" "}
                  <span className="text-slate-600">+ PDF / + Word</span> attach files without opening
                  details
                </p>
              </div>
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {rows.map((row) => (
                <li key={row.id} className="flex flex-col lg:flex-row lg:items-stretch">
                  <button
                    type="button"
                    onClick={() => openDetail(row.id)}
                    className="min-w-0 flex-1 px-5 py-4 text-left transition hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]/50"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          row.source === "dynamic"
                            ? "border border-[var(--accent)]/35 bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {row.source === "dynamic" ? "Catalog" : "Built-in"}
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        {row.sector}
                      </span>
                    </div>
                    <div className="mt-2 font-[family-name:var(--font-space)] text-base font-semibold text-white">
                      {row.title}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-slate-500">{row.slug}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>{row.effectivePriceUsdt} USDT</span>
                      <span className="text-slate-700">·</span>
                      <span className="flex items-center gap-1">
                        PDF <SourceChip custom={Boolean(row.overridePdfPath)} />
                      </span>
                      <span className="flex items-center gap-1">
                        Word <SourceChip custom={Boolean(row.overrideDocPath)} />
                      </span>
                    </div>
                  </button>
                  <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-4 py-3 lg:w-[min(100%,22rem)] lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0 lg:px-3">
                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1.5 text-center text-xs font-medium text-slate-200 transition hover:border-[var(--accent)]/35 hover:bg-[var(--accent)]/5">
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
                      <label className="cursor-pointer rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1.5 text-center text-xs font-medium text-slate-200 transition hover:border-[var(--accent)]/35 hover:bg-[var(--accent)]/5">
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
                          className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-2.5 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/15 disabled:opacity-50"
                        >
                          − PDF
                        </button>
                      ) : null}
                      {row.overrideDocPath ? (
                        <button
                          type="button"
                          disabled={busyId === `${row.id}-rm-doc`}
                          onClick={() => void removeFile(row.id, "doc")}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-2.5 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/15 disabled:opacity-50"
                        >
                          − Word
                        </button>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      disabled={busyId === `rm-${row.id}`}
                      onClick={() => void removeFromCatalog(row)}
                      className="w-full rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200 disabled:opacity-50"
                    >
                      {row.source === "dynamic" ? "Delete report" : "Remove from catalog"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </GlassPanel>

          {hiddenBuiltins.length > 0 ? (
            <GlassPanel className="mt-6 border border-amber-500/15 bg-amber-500/[0.04] p-5">
              <h3 className="font-[family-name:var(--font-space)] text-sm font-semibold text-amber-200">
                Hidden built-in reports
              </h3>
              <p className="mt-1 text-xs text-amber-200/70">
                These still ship in the codebase but are not shown on the public site. Restore to
                bring them back.
              </p>
              <ul className="mt-4 space-y-2">
                {hiddenBuiltins.map((h) => (
                  <li
                    key={h.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{h.title}</div>
                      <div className="font-mono text-[11px] text-slate-500">{h.slug}</div>
                    </div>
                    <button
                      type="button"
                      disabled={busyId === `restore-${h.id}`}
                      onClick={() => void restoreBuiltin(h.id)}
                      className="shrink-0 rounded-lg border border-[var(--accent)]/40 px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/10 disabled:opacity-50"
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            </GlassPanel>
          ) : null}
        </>
      ) : null}

      {authed && selectedRow ? (
        <div className="mt-8 space-y-6">
          <button
            type="button"
            onClick={closeDetail}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-[var(--accent)]"
          >
            <span aria-hidden>←</span> All documents
          </button>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlassPanel className="border border-white/[0.08] p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                    selectedRow.source === "dynamic"
                      ? "border border-[var(--accent)]/35 bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "bg-slate-500/20 text-slate-300"
                  }`}
                >
                  {selectedRow.source === "dynamic" ? "Catalog" : "Built-in"}
                </span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-400">
                  {selectedRow.sector}
                </span>
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-space)] text-2xl font-semibold text-white">
                {selectedRow.title}
              </h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Report id</dt>
                  <dd className="mt-0.5 font-mono text-xs text-slate-300">{selectedRow.id}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Slug</dt>
                  <dd className="mt-0.5 font-mono text-xs text-slate-300">{selectedRow.slug}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Effective price</dt>
                  <dd className="mt-0.5 text-xl font-semibold text-white">
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
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Defaults (code / DB body)</dt>
                  <dd className="mt-1 space-y-1 break-all font-mono text-[10px] leading-relaxed text-slate-500">
                    <div>PDF: {selectedRow.defaultPdfPath}</div>
                    <div>Word: {selectedRow.defaultDocPath}</div>
                    <div>Price: {selectedRow.defaultPriceUsdt} USDT</div>
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/report/${selectedRow.slug}`}
                  className="inline-flex rounded-lg border border-[var(--accent)]/40 px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/10"
                >
                  Open public page
                </Link>
                <button
                  type="button"
                  disabled={busyId === `rm-${selectedRow.id}`}
                  onClick={() => void removeFromCatalog(selectedRow)}
                  className="rounded-lg border border-rose-500/35 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-50"
                >
                  {selectedRow.source === "dynamic" ? "Delete report" : "Remove from catalog"}
                </button>
              </div>
            </GlassPanel>

            <GlassPanel className="border border-white/[0.08] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
                Settings
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                Price overrides live in <span className="font-mono">report_overrides</span>. File
                uploads go to <span className="font-mono">public/reports/uploads/</span>.
              </p>

              <section className="mt-6 border-t border-white/10 pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Price (USDT)
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  DB override:{" "}
                  {selectedRow.overridePriceUsdt === null ? "none" : selectedRow.overridePriceUsdt}{" "}
                  · Base: {selectedRow.defaultPriceUsdt}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={priceDraft[selectedRow.id] ?? ""}
                    onChange={(e) =>
                      setPriceDraft((d) => ({ ...d, [selectedRow.id]: e.target.value }))
                    }
                    className="w-36 rounded-lg border border-white/12 bg-[#070b18] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[var(--accent)]/50"
                  />
                  <button
                    type="button"
                    disabled={busyId === selectedRow.id}
                    onClick={() => void savePrice(selectedRow.id)}
                    className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#0A0F1F] transition hover:brightness-110 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={busyId === selectedRow.id}
                    onClick={() => void revertPrice(selectedRow.id)}
                    className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                  >
                    Revert
                  </button>
                </div>
              </section>

              <section className="mt-6 border-t border-white/10 pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  PDF
                </h4>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SourceChip custom={Boolean(selectedRow.overridePdfPath)} />
                  <label className="cursor-pointer rounded-lg border border-white/12 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5">
                    Upload
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
                      className="rounded-lg border border-rose-500/35 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      Remove upload
                    </button>
                  ) : null}
                </div>
              </section>

              <section className="mt-6 border-t border-white/10 pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Word
                </h4>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SourceChip custom={Boolean(selectedRow.overrideDocPath)} />
                  <label className="cursor-pointer rounded-lg border border-white/12 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5">
                    Upload
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
                      className="rounded-lg border border-rose-500/35 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-50"
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
