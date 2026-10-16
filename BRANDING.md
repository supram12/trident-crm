# Trident CRM — brand changes

Re-verify after every upstream merge: `node scripts/brand.mjs apply && node scripts/brand.mjs check`.

| What | Where | How |
|---|---|---|
| UI + email wording | all `.po` catalogs | `scripts/brand.mjs apply` (also runs in Dockerfile after lingui extract) |
| Docker hook | `packages/twenty-docker/twenty/Dockerfile` | `brand.mjs apply` between extract and compile |
| Icons (android, ios, windows11 PNGs) | `packages/twenty-front/public/images/icons/*` | `node scripts/make-icons.mjs` renders `brand/trident_mark.svg` at 72% of the short side on flat wine `#1C0B12`; also writes `brand/icon-192.png` |
| Tab title, og/twitter title, description | `packages/twenty-front/index.html` | edited by hand |
| PWA name, theme and background colour | `packages/twenty-front/public/manifest.json` | edited by hand (`#1C0B12`) |
| Default workspace logo | `packages/twenty-front/src/modules/ui/navigation/navigation-drawer/constants/DefaultWorkspaceLogo.ts` | points at the 192px Trident icon |
| Terms and privacy links | `packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx` | `trident-ai.dev/terms` and `/privacy` (no `.html`: it 301-redirects) |

`packages/twenty-website` catalogs are deliberately not rebranded: that package is not deployed.

The email footer msgid "Twenty.com, Public Benefit Corporation" is mapped to "Trident CRM by Trident AI" in every locale (a `Twenty.com` domain or PBC claim would be false); any other `Twenty.com` becomes plain "Trident CRM".