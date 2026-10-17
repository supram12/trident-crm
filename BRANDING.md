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
| Social-card meta | `packages/twenty-front/index.html` | og:image and twitter:image removed (they pointed at the Twenty card); `brand.mjs check` fails on any `twentyhq` or `twenty.com` in the file |
| Theme colours (accent, UI blue, dark surfaces, dark greys) | `packages/twenty-ui/src/theme-constants/theme-light.css`, `theme-dark.css` (+ tracked copies in `packages/twenty-ui/dist/`) | edited by hand; see below |
| Text on filled blue surfaces | `packages/twenty-ui/src/input/button/components/Button/Button.tsx` (2 lines), `AnimatedButton.tsx` (1 line), `packages/twenty-ui/src/navigation/notification-counter/components/NotificationCounter.tsx`, `packages/twenty-front/src/modules/layout-customization/components/LayoutCustomizationBar.tsx` + `LayoutCustomizationBarMenuDropdown.tsx` | `GRAY_SCALE_LIGHT.gray1` / `'white'` (always white) → `themeCssVariables.font.color.inverted` (white in light, near-black in dark), so dark text on gold is 8.53:1 |
| Dark loading background | `packages/twenty-front/index.html` | `--theme-dark-background-tertiary: #2e1420` (mirrors dark background tertiary) |
| Documentation link | `packages/twenty-shared/src/constants/DocumentationBaseUrl.ts` | `https://trident-ai.dev` (no Trident docs yet) |
| Settings → Community cards | `packages/twenty-front/src/pages/settings/community/SettingsCommunity.tsx` | Partners → trident-ai.dev, Support → trident-ai.dev/#contact (was Twenty's Discord), Releases → github.com/supram12/trident-crm/releases |
| Admin Panel version | `SettingsAdminVersionDisplay.tsx`, `admin-panel-version.service.ts` | link → our GitHub releases; "latest version" = current, no call to Twenty's Docker Hub |
| Login / 404 backdrop | `DefaultLayout.tsx`, `NotFound.tsx` | upstream `sign-in-background-mock` (demo workspace, "Tim Apple", Rockets/Pets) no longer rendered; the module stays for merges |
| save() update events (bug fix, not branding) | `packages/twenty-server/src/engine/twenty-orm/entity-manager/workspace-entity-manager.ts` | save() re-reads the updated rows for the UPDATED event's `after`. Upstream emits the persisted entity, which carries column defaults for every field the partial omitted (avatarUrl '', userEmail '', createdBy…), so `WorkspaceMemberAvatarFileDeletionListener` deleted the profile picture on every theme/locale change (fixed in trident.7 after trident.3–.6 misses). Re-check after each upstream merge: upload an avatar, switch theme, avatar must still load. |

`packages/twenty-website` catalogs are deliberately not rebranded: that package is not deployed.

The email footer msgid "Twenty.com, Public Benefit Corporation" is mapped to "Trident CRM by Trident AI" in every locale (a `Twenty.com` domain or PBC claim would be false); any other `Twenty.com` becomes plain "Trident CRM".

## Theme colours

The app reads colours from the CSS variables in `packages/twenty-ui/src/theme-constants/theme-*.css` (`ThemeProvider` computes the JS theme from them). The TS constants in `src/theme/constants/` are not read at runtime and are left as upstream. The vite build copies the CSS into `dist/`. If an upstream merge rewrites these CSS files, re-apply the values below. Palette source: `brand_assets/brand_board.html`.

Light accent (wine, OKLCH ramp at the hue of `#381927`, chroma never above the wine's own): 1 `#FFFCFD` 2 `#FDF7FA` 3 `#F9EFF3` 4 `#F4E5EA` 5 `#ECD8E0` 6 `#E3CAD3` 7 `#D5B6C2` 8 `#C29CAB` 9 `#381927` 10 `#2E1420` 11 `#5E3C4A` 12 `#26101A`.

Dark accent (gold; steps 1–8 are `#D4AF37` laid over `#1C0B12` at 3/6/10/15/20/27/36/50%): 1 `#221013` 2 `#271514` 3 `#2E1B16` 4 `#382418` 5 `#412C19` 6 `#4E371C` 7 `#5E461F` 8 `#785D25` 9 `#D4AF37` 10 `#B8912A` 11 `#F5D07E` 12 `#F9EDD5`.

Accent aliases follow Twenty's own mapping in both themes: primary/secondary = step 5, tertiary = 3, quaternary = 2, accent3570/accent4060 = 8.

Dark surfaces: background primary `#1C0B12`, secondary `#26101A`, tertiary `#2E1420`, quaternary `#381927`.

UI blue is the brand accent. `--t-color-blue`, `--t-color-blue1`–`12`, `--t-border-color-blue` (= step 7), `--t-buttons-secondary-text-color` (button hotkey hint: light step 7, dark step 6), `--t-snack-bar-info-color` (= step 9) use the same wine (light) and gold (dark) scales as the accent. `--t-background-transparent-blue`, `--t-snack-bar-info-background-color` and `--t-color-transparent-blue1`–`12` keep upstream's alpha byte with `#381927` (light) or `#D4AF37` (dark); upstream's two opaque dark steps (11, 12) take gold steps 11 and 12. Exception: dark `--t-background-transparent-blue` is `#d4af373f` (alpha 0x3f, not upstream 0x57) so gold banner text reaches 4.5:1 on every wine surface.

Left as user data colours: `--t-tag-text-blue`, `--t-tag-background-blue`, `--t--illustration-icon-color-blue`, `--t--illustration-icon-fill-blue`.

By-name side effects (accepted): `theme.color[name]` lookups resolve "blue" to the brand accent. An icon coloured "blue" in the IconPicker shows wine (light) or gold (dark); a placeholder avatar whose name hashes to "blue" (`stringToThemeColorP3String`) does the same.

Dark greys lifted to reach 4.5:1 on every wine surface: `--t-font-color-tertiary` 0.506 → 0.6 (`#999999`), `--t-font-color-light` 0.4 → 0.541 (`#8A8A8A`). Light-theme greys are upstream.

Not changed: font colours other than the two dark greys, grey scale, tags, red/green/orange families.

## Email templates

| What | Value |
|---|---|
| Logo | `packages/twenty-front/public/images/trident/email-logo.png`, 320x300 opaque PNG, shown at 160x150. Made by `scripts/make-email-logo.mjs`: the unmodified lockup, centred on a flat `#1C0B12` band (the lockup's wordmark is near-white, so it needs a dark ground). |
| Logo URL | `${SERVER_URL}/images/trident/email-logo.png`. `EMAIL_BASE_URL` in `twenty-emails/src/constants/DefaultWorkspaceLogo.ts` reads `process.env.SERVER_URL` (fallback `https://crm.trident-ai.dev`, preview tool only). |
| Footer | One link, Website -> `https://trident-ai.dev`. Text "Trident CRM by Trident AI" comes from the catalog msgstr (`brand.mjs apply`); the upstream msgid stays as the lookup key. Github / User guide / Developers links and the "San Francisco / Paris" line are removed. |
| Default workspace logo in emails | The A3 192px app icon on `SERVER_URL`. |

## CI

| What | Value |
|---|---|
| Upstream workflows | Upstream CI workflows disabled on GitHub with `gh workflow disable` (not moved — keeps upstream merges clean). Re-run the disable after any upstream merge that adds a workflow. |
| Image build | `.github/workflows/trident-image.yml` builds `ghcr.io/supram12/trident-crm:<tag>` and `:latest` on tags `v*-trident.*`. |
| Dependabot | `.github/dependabot.yml` deleted. Trident CRM tracks upstream release tags only; dependency bumps arrive via upstream merges. |
| Merge recipe | On `.po` conflicts: `git checkout --theirs -- '*.po' && node scripts/brand.mjs apply && node scripts/brand.mjs check`. On theme CSS conflicts: resolve `src/theme-constants`, then copy src to `dist`. On a dependabot.yml modify/delete conflict: `git rm .github/dependabot.yml`. After any merge: re-disable new upstream workflows. |
| APP_VERSION | Bump the `build-args` `APP_VERSION` in `trident-image.yml` and the image tag on every upstream release merge. |
| Image tags | The workflow builds `--target twenty` (server + frontend). `v2.9.0-trident.1` on GHCR was built from the wrong stage (upstream's all-in-one dev image): never deploy it. Use `v2.9.0-trident.2` or later. The `build` job runs on tag pushes only, so a manual dispatch cannot move `:latest`. |
| Source-code link | AGPL s13: "Source code" -> `https://github.com/supram12/trident-crm` in `FooterNote.tsx` (both branches) and the email `Footer.tsx`. `brand.mjs check` fails if either loses it. |
| Hard-coded literals | `'Trident CRM'` replaces `'Twenty'` in `getTimelineActivityAuthorFullName.ts` (API-written record author), `title-utils.ts` (default tab title), `DefaultWorkspaceName.ts`, and the Links example label in `SettingsCompositeFieldTypeConfigs.ts`. `brand.mjs check` fails on any quoted `'Twenty'`/`"Twenty"` in `twenty-front/src` (tests, stories, mocks, locales, generated excluded; `apollo.factory.ts` logger name excluded by path). |
| Browser chrome | `index.html` `theme-color` is `#1C0B12`. |
