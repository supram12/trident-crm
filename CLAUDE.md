# Trident CRM

Trident AI's fork of Twenty (AGPLv3), sold to clients as Trident CRM.
Spec: ../docs/superpowers/specs/2026-10-16-trident-crm-design.md
Plan: ../docs/superpowers/plans/2026-10-16-trident-crm.md

- Own git repo: origin = supram12/trident-crm (PUBLIC — AGPL), upstream = twentyhq/twenty.
- Merge upstream **release tags only**: `git fetch upstream --tags && git merge vX.Y.Z`,
  then `node scripts/brand.mjs apply && node scripts/brand.mjs check`.
- Every brand change is listed in BRANDING.md. Keep it that way.
- Never edit files marked `/* @license Enterprise */`.
- Node 24: `export PATH="$HOME/.local/node24/bin:$PATH"`. No Docker locally —
  images build in GitHub Actions (.github/workflows/trident-image.yml).
- One Railway project per client: `scripts/new-client.sh <client> <domain>`.
