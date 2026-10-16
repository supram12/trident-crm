# Trident CRM — brand changes

Re-verify after every upstream merge: `node scripts/brand.mjs apply && node scripts/brand.mjs check`.

| What | Where | How |
|---|---|---|
| UI + email wording | all `.po` catalogs | `scripts/brand.mjs apply` (also runs in Dockerfile after lingui extract) |
| Docker hook | `packages/twenty-docker/twenty/Dockerfile` | `brand.mjs apply` between extract and compile |

`packages/twenty-website` catalogs are deliberately not rebranded: that package is not deployed.

The email footer msgid "Twenty.com, Public Benefit Corporation" is mapped to "Trident CRM by Trident AI" in every locale (a `Twenty.com` domain or PBC claim would be false); any other `Twenty.com` becomes plain "Trident CRM".
