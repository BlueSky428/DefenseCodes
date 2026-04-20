-- Run this in the Neon SQL Editor (or `psql`) after creating a project.
-- https://console.neon.tech

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  chain_id BIGINT NOT NULL,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT purchases_chain_tx_unique UNIQUE (chain_id, tx_hash)
);

CREATE INDEX IF NOT EXISTS purchases_wallet_lower_idx
  ON purchases (lower(wallet_address));

CREATE INDEX IF NOT EXISTS purchases_wallet_report_idx
  ON purchases (lower(wallet_address), report_id);

-- Admin-managed pricing and deliverable paths (see /admin). Paths are public URLs under /reports/…
CREATE TABLE IF NOT EXISTS report_overrides (
  report_id TEXT PRIMARY KEY,
  price_usdt NUMERIC(12, 4),
  doc_public_path TEXT,
  pdf_public_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin-created reports (full JSON body). Built-ins stay in code; use report_catalog_hidden to hide them.
CREATE TABLE IF NOT EXISTS report_definitions (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  body JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_catalog_hidden (
  report_id TEXT PRIMARY KEY
);
