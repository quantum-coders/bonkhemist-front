# Bonkhemist Landing "Start Here" (ES/EN) — Design

**Date:** 2026-06-25
**Scope:** `bonkhemist-front` only. New marketing landing page. No backend changes.
**Branch:** `feat/landing-start-here`

## Goal

A high-impact, bilingual (ES/EN) landing page that explains what Bonkhemist is
and how to play, with strong readability, and routes visitors into the game.
"Chingona" — distinctive, polished, on-brand pixel-art, not a templated default.

## Decisions (agreed in brainstorming)

| Decision | Choice |
|----------|--------|
| Route | `/start-here` (new). Game stays at `/`, leaderboard at `/leaderboard` — unchanged. |
| Entry into game | Big PLAY/JUGAR CTA → `/`. |
| Entry into landing | Subtle "How to play / ¿Qué es esto?" link in the game header (`pages/index.vue` app-header) → `/start-here`. |
| Language | Reuse existing `@nuxtjs/i18n`; new `landing.*` namespace; switcher reused. |
| Visual | Reuse + elevate the existing pixel-art brand. |
| Backend | None. |

## Visual system

- **Background:** Bonk yellow + shiba pattern (`/images/yellow-pattern.png`), consistent with the game.
- **Type:** `Bungee` for big display headings (impact), `Silkscreen` for pixel accents/labels, `Inter` for body copy (readability — this is the lever for "impactante readability").
- **Color:** brand green `#0EDCA4`, black `#000`, white panels; hard pixel borders + offset drop-shadows (matching the game's panel look). Purple/green logo accents.
- **Motion:** subtle, tasteful — floating element tiles, hover glow on CTAs, fade/slide-in on scroll. Respect `prefers-reduced-motion`.
- **Assets (existing, in `public/images/`):** `logo.png`, `bonk_coin.png`, `doge.png`, `dogwifhat-wif-logo.png`, `cloud.png`, `balloon.png`, `mint.png`, `solana.png`, `nft-image.png`, `bonk-sheet.png`, combining frame pieces.

## Sections (single vertical scroll, clear narrative)

1. **Hero** — large `logo.png` + Bungee tagline ("Mezcla. Descubre. Mintea." / "Mix. Discover. Mint."), one-line subhead, primary CTA **JUGAR / PLAY** (→ `/`), EN/ES switcher top-right. Floating element tiles + coin/doge art.
2. **What is Bonkhemist** — one punchy paragraph: combine elements, an AI generates brand-new results, mint your discoveries as NFTs on Solana. 3 quick value chips (AI-generated, First-Discovery NFTs, On Solana).
3. **How to play** — the 4 steps, reusing the already-translated narrative from `HowTo.vue`: Connect wallet → Mix elements → Discover → Mint. Numbered cards with an icon/visual each.
4. **The magic (combos)** — visual showcase of example combinations (Water + Fire = Steam, Air + Water = Cloud, …) using element tiles to convey the core loop.
5. **Mint & Solana** — the crypto/NFT angle: first-discoverer ownership, permanent on-chain NFT, BONK. Uses `mint.png` / `solana.png` / `nft-image.png`.
6. **Final CTA** — "Empieza tu primer experimento / Start your first experiment" + PLAY/JUGAR button.
7. **Footer** — brand, minimal links (reuse `SiteFooter` if/when it has content; otherwise a small landing footer).

## Architecture / files

- `pages/start-here.vue` — the page; composes the section components, sets page `<head>` (title/OG), holds the `landing.*` copy wiring.
- `components/Landing/LandingHero.vue`
- `components/Landing/LandingWhatIs.vue`
- `components/Landing/LandingHowToPlay.vue`
- `components/Landing/LandingCombos.vue`
- `components/Landing/LandingMint.vue`
- `components/Landing/LandingCta.vue` (shared final-CTA / reusable PLAY button)
- One component per section → focused, independently editable files.
- `components/LanguageSwitcher.vue` reused in the hero.
- `pages/index.vue` — add ONE subtle link in the app-header → `/start-here` (text via `$t`).
- `locales/en.json` + `locales/es.json` — new `landing.*` namespace; key parity maintained (gate: `yarn i18n:check`).

## i18n

- All landing copy under `landing.*` (hero, whatIs, howTo steps, combos labels, mint, cta, footer).
- English verbatim authored fresh (this is new copy); natural Spanish with proper `¡`/`¿`.
- Reuse `<i18n-t>` for any line mixing inline markup/emphasis.
- Both locale files keep an identical key set.

## Responsive

- Mobile-first. Hero and section layouts stack on small screens; element-tile decorations scale/hide as needed. Tested at ~375px, ~768px, ~1280px.

## Verification

- `yarn i18n:check` passes (locale parity incl. new `landing.*`).
- Visual verification in browser at `/start-here` in BOTH languages, at mobile + desktop widths (screenshots).
- Navigation works: landing PLAY → `/`; game header link → `/start-here`.

## Non-goals

- No backend/API changes. No new data. No auth/wallet logic on the landing (PLAY just routes to the game).
- Not moving the game off `/`.
- No new languages beyond ES/EN.
- No blog/docs/pricing — just the single landing.
