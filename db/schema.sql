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
