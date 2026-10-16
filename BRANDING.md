# Trident CRM — brand changes

Re-verify after every upstream merge: `node scripts/brand.mjs apply && node scripts/brand.mjs check`.

| What | Where | How |
|---|---|---|
| UI + email wording | all `.po` catalogs | `scripts/brand.mjs apply` (also runs in Dockerfile after lingui extract) |
| Docker hook | `packages/twenty-docker/twenty/Dockerfile` | `brand.mjs apply` between extract and compile |
