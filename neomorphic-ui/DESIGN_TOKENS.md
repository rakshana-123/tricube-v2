# Neo UI · Design Token Reference

Token source: [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) → `design-md/apple/DESIGN.md` (v2.2).
Implementation: React 19 + CSS Modules, zero runtime dependencies beyond React.

Every value below is either **verbatim from the MD** (marked `MD`) or a **documented
neomorphic extension** (marked `NEO`) derived from the MD's depth approach
(alpha-blended blacks, no borders, no gradients).

## Color

| Token | Value | Source | Notes |
|---|---|---|---|
| `--color-primary` | `#0066cc` | MD `primary` | Action Blue — all interaction |
| `--color-primary-focus` | `#0071e3` | MD `primary-focus` | Hover + focus ring |
| `--color-primary-on-dark` | `#2997ff` | MD `primary-on-dark` | Dark-mode accent |
| `--color-ink` / `--text-primary` | `#1d1d1f` | MD `ink` | 15.4:1 on parchment (AAA) |
| `--color-ink-80` | `#333333` | MD `ink-muted-80` | Secondary text |
| `--color-ink-48` | `#7a7a7a` | MD `ink-muted-48` | Tertiary — large text/UI only (3.9:1) |
| `--canvas` (light) | `#f5f5f7` | MD `canvas-parchment` | Global background |
| `--canvas-contrast` (light) | `#ffffff` | MD `canvas-white` | Alternating bands |
| `--surface-raised` (light) | `#fafafc` | MD `surface-pearl` | Extruded components |
| `--surface-sunken` (light) | `#f0f0f3` | NEO | Pearl −1 step, recessed wells |
| `--canvas` (dark) | `#252527` | MD `surface-tile-3` | |
| `--surface-raised` (dark) | `#2a2a2c` | MD `surface-tile-2` | |
| `--surface-inverse` | `#272729` | MD `surface-tile-1` | Dark utility / inverse tiles |
| `--color-hairline` | `#e0e0e0` | MD `hairline` | The one allowed border |
| `--color-chip-gray` | `#d2d2d7` | MD `surface-chip-translucent` | |
| `--color-error` (light) | `#e30000` | NEO | Closes MD's "undocumented form errors" gap · 4.69:1 |
| `--color-error` (dark) | `#ff6359` | NEO | Lifted from system red to 4.91:1 |

## Typography — SF Pro ladder (all MD-verbatim)

Stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif`
Rules: negative tracking **only ≥17px**; weights 300/400/600/700 (never 500); body is **17px**, not 16.

| Token | px / weight / lh / ls |
|---|---|
| hero-display | 56 / 600 / 1.07 / −0.28px |
| display-lg | 40 / 600 / 1.1 / 0 |
| display-md | 34 / 600 / 1.47 / −0.374px |
| lead | 28 / 400 / 1.14 / 0.196px |
| lead-airy | 24 / 300 / 1.5 / 0 |
| tagline | 21 / 600 / 1.19 / 0.231px |
| body-strong | 17 / 600 / 1.24 / −0.374px |
| body | 17 / 400 / 1.47 / −0.374px |
| dense-link | 17 / 400 / 2.41 / 0 |
| caption / caption-strong | 14 / 400·600 / 1.43·1.29 / −0.224px |
| button-large | 18 / 300 / 1 / 0 |
| button-utility | 14 / 400 / 1.29 / −0.224px |
| fine-print | 12 / 400 / 1 / −0.12px |
| micro-legal | 10 / 400 / 1.3 / −0.08px |
| nav-link | 12 / 400 / 1 / −0.12px |

Dynamic Type: every size is `calc(size * var(--dt-scale))`; `useDynamicType()` sets
XS(0.875) / M(1) / L(1.12) / XL(1.25) / 2XL(1.4) / AX(1.6) — the iOS content-size ladder.

## Radii (MD)

`xs 5` · `sm 8` · `md 11` · `lg 18` · `pill 9999` · `none 0`

## Spacing — 4px base grid (MD)

`xxs 4` · `xs 8` · `sm 12` · `md 17` · `lg 24` · `xl 32` · `xxl 48` · `section 80`
Card padding: 24 (MD token).

## Elevation (NEO, from MD depth approach)

Light theme (top-left light source, alpha-blended blacks + near-white speculars):

| Step | Value |
|---|---|
| `--neo-raised-xs` | `2px 2px 5px rgba(0,0,0,.07), -2px -2px 5px rgba(255,255,255,.85)` |
| `--neo-raised-sm` | `4px 4px 8px rgba(0,0,0,.08), -4px -4px 8px rgba(255,255,255,.9)` |
| `--neo-raised-md` | `6px 6px 14px rgba(0,0,0,.1), -6px -6px 14px rgba(255,255,255,.92)` |
| `--neo-raised-lg` | `12px 12px 28px rgba(0,0,0,.12), -12px -12px 28px rgba(255,255,255,.95)` |
| `--neo-inset-xs` | `inset 2px 2px 4px rgba(0,0,0,.09), inset -2px -2px 4px rgba(255,255,255,.85)` |
| `--neo-inset-sm` | `inset 3px 3px 6px rgba(0,0,0,.1), inset -3px -3px 6px rgba(255,255,255,.85)` |
| `--neo-inset-md` | `inset 5px 5px 10px rgba(0,0,0,.12), inset -5px -5px 10px rgba(255,255,255,.9)` |
| `--neo-product` | `3px 5px 30px rgba(0,0,0,.22)` — **MD-verbatim hero shadow** |

Dark theme mirrors the ladder with `rgba(0,0,0,.4–.6)` shades and
`rgba(255,255,255,.035–.07)` speculars — see `tokens.css`.

## Frosted material (MD-verbatim)

`backdrop-filter: saturate(180%) blur(20px)` over `rgba(canvas, 0.72)`.

## Motion

| Token | Value | Source |
|---|---|---|
| press transform | `scale(0.95)` | MD `micro-interactions:active` |
| `--dur-press-in` | `120ms` ease-out | NEO |
| `--dur-press-out` | `420ms` | NEO |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | NEO ≈ UIKit `spring(stiffness:500, damping:30)` |
| `--dur-control` | `300ms` | NEO |

## Haptic mapping (`useHaptics`)

| Semantic | UIKit (SwiftUI port) | Web Vibration |
|---|---|---|
| selection | `UISelectionFeedbackGenerator` | `vibrate(8)` |
| light / medium / heavy | `UIImpactFeedbackGenerator(.light/.medium/.heavy)` | `12 / 20 / 30ms` |
| success / warning / error | `UINotificationFeedbackGenerator` | `[10,40,18]` / `[22,40,22]` / `[30,60,30,60,30]` |

## Layout

- Breakpoints (MD): **1440 / 1068 / 834 / 734 / 640 / 480** — grid collapses 5→4→3→2→1
- Touch target minimum: **44px** (MD)
- Nav heights: global **44px**, frosted sub-nav **52px**, floating bar **64px** (MD)
- Safe areas: `viewport-fit=cover` + `env(safe-area-inset-*)` on all four edges

## Component specs

| Component | Anatomy (MD-derived) |
|---|---|
| NeoButton primary | Blue pill, padding `11px 22px`, hover `#0071e3`, press `scale(.95)` |
| NeoButton dark utility | Tile-1 `#272729`, radius `8px`, white label |
| NeoButton pearl capsule | Pearl `#fafafc`, radius `11px` |
| NeoChip selected | `2px solid #0071e3` border (MD chip spec, verbatim) |
| NeoInput | Recessed well, radius `11px`, focus ring `2px solid #0071e3` + tint bloom |
| NeoToggle | 51×31 track, 25px pearl thumb, spring travel, selection haptic |
| NeoSlider | Sunken rail, accent fill, pearl thumb scales 1.12 while dragged, detent haptics |
| NeoSegmented | Recessed group, raised cap slides on spring, radio semantics + arrows |
| NeoCard | Radius `18px`, padding `24px`; raised / pearl / sunken / outlined / dark |
| NeoNavBar | Frosted `52px` (sub) or dark `44px` (global), safe-area aware |

## Accessibility

- Focus ring everywhere: `2px solid #0071e3`, offset `2px` (MD-verbatim); dark mode `#2997ff`
- WCAG pairings verified at runtime in the showcase (§01)
- `prefers-reduced-motion` collapses all durations to 1ms
- All controls keyboard-operable; slider/segmented expose ARIA widget semantics

## Run

```bash
cd neomorphic-ui
npm install
npm run dev      # showcase at http://localhost:5173
npm run build    # type-check + production bundle
```

Deep-linkable themes for screenshots and sharing: `/?theme=light` and `/?theme=dark`
(overrides stored preference; header toggle still flips live).

## Verification

```bash
npm run build
npm run preview             # serve dist on :4173
npm run verify:interact     # drives real clicks/keys through Edge (puppeteer-core):
                            # theme toggle, switch, segmented arrows, Dynamic Type,
                            # slider drag + keys, chip toggle — 7 checks
npm run verify:screens      # captures section screenshots to ../shots
```

`puppeteer-core` drives the system Edge — no browser download. On machines without
Edge at the default path, update `EDGE` in `scripts/*.mjs`.

## Host-app integration (TRI CUBE frontend)

The same library is mounted inside the production app at `src/components/neoui/`,
namespaced under a `.neo-ui` wrapper so the host's Tailwind/oklch tokens are
untouched (verified: no `.neo-ui` leakage or `data-theme` writes on existing pages).

- **`/studio`** — the learner app UI (Home / Browse / Profile) built entirely from
  the neomorphic components, running on real catalog data (`@/lib/site-data`),
  with frosted nav, floating pill tab bar, light/dark + Dynamic Type (gear menu),
  and course cards that deep-link into the real `/courses/$slug` pages.
- **`/design-system`** — this showcase, mounted as a route.
- Both routes declare `staticData: { bare: true }`; `__root.tsx`'s `SiteChrome`
  skips the site navbar/footer for bare routes.
- Deep links: `?neotheme=light|dark` overrides the stored theme per visit.

**Host pipeline caveat:** Tailwind v4's LightningCSS strips `backdrop-filter`
declarations that reference unsubstituted `var()`, so the MD frost recipe
(`saturate(180%) blur(20px)`) is applied as an inline style via
`FROSTED_RECIPE` from `NeoUI.tsx` on the frosted surfaces. `box-shadow: var()`
declarations pass through unharmed and were verified computed in the built app.

## TRI CUBE brand retheme — before → after

Brand colors pixel-sampled from the supplied logo set (white-bg square logo,
teal wide lockup, navy lockup, blue lockup): **navy `#0E263A`, brand blue
`#265CA0`, bright blue `#26A4E6`, teal `#2EA5A1`, gold `#C9962E`**.
All 20 WCAG pairings verified AA (`scripts/brand-contrast.mjs`).

### Light theme (white primary)

| Token (`.neo-ui`) | Before | After | Why |
|---|---|---|---|
| `--canvas` | `#f5f5f7` parchment | **`#FFFFFF`** | white-primary requirement |
| `--canvas-contrast` | `#ffffff` | `#f5f5f7` | bands invert: gray on white |
| `--surface-raised` / `--surface-elevated` | `#fafafc` pearl | `#FFFFFF` | pure white cards |
| `--surface-sunken` | `#f0f0f3` | `#f5f5f7` | wells keep recessed read |
| `--accent-bg` (buttons, toggles-on, slider fill, links) | `#0066cc` | **`#265CA0`** `rgb(38,92,160)` | brand blue · 6.73:1 on white |
| `--accent-bg-hover` | `#0071e3` | `#1C4680` `rgb(28,70,128)` | 9.39:1 |
| `--accent-on` (new) | — | `#FFFFFF` | 6.73:1 on brand blue |
| `--focus-ring` | `#0071e3` | `#265CA0` | AA + ≥3:1 UI |
| `--chip-border-selected` | `#0071e3` | `#265CA0` | |
| `--highlight-tint` | `rgba(0,113,227,.08)` | `rgba(38,92,160,.08)` | hover wash |
| `--shadow-color-focus-tint` | `rgba(0,113,227,.25)` | `rgba(38,92,160,.22)` | |
| `--primary-cast` | `rgba(0,102,204,.5)` | `rgba(38,92,160,.45)` | CTA cast shadow |
| `--surface-inverse` (dark utility tiles) | `#272729` | **`#0E263A`** brand navy | white on it 14.4:1 |
| shadow shades `--neo-*` | `rgba(0,0,0,α)` | `rgba(14,38,58,α)` navy-tinted | depth visible on pure white |
| `--text-tertiary` | `#7a7a7a` (4.0:1) | `#6b6b70` (**5.30:1 AA**) | contrast lift |
| `--color-error` | `#e30000` | `#d70015` | 5.38:1 |
| `--badge-teal` / `--badge-gold` (new) | — | `#2EA5A1` / `#C9962E` | live dots / premium, decorative only |
| `--badge-gold-fg` / `--badge-gold-bg` (new) | — | `#8a6420` / `rgba(201,150,46,.14)` | AA gold chip text (4.75:1) |
| `--frosted-bg` | `rgba(245,245,247,.72)` | `rgba(255,255,255,.72)` | white frost |

### Dark theme (brand navy inversion)

| Token | Before | After |
|---|---|---|
| `--canvas` | `#252527` | **`#0E263A`** logo navy |
| `--canvas-contrast` | `#1d1d1f` | `#0a1c30` |
| `--surface-raised` / `--surface-elevated` | `#2a2a2c` | `#142E52` / `#16325A` |
| `--surface-sunken` | `#212123` | `#0b1c33` |
| `--accent-bg` | `#2997ff` | **`#26A4E6`** (5.55:1 on navy) |
| `--accent-on` (new) | — | `#0E263A` navy text on sky-blue fills |
| `--text-primary/secondary/tertiary` | `#f5f5f7/#cccccc/#98989d` | `#f5f7fa / #c8d4e2 / #93a7c0` |
| shadow shades | `rgba(0,0,0,.4–.6)` | `rgba(2,10,20,.45–.6)` + sky speculars `rgba(120,180,235,.05–.09)` |
| `--badge-teal` / `--badge-gold` | — | `#3fc0bb` / `#dcae4e` |
| `--frosted-bg` | `rgba(37,37,39,.72)` | `rgba(14,38,58,.74)` |
| `--nav-global-bg` (new) | `rgba(29,29,31,.82)` | `rgba(14,38,58,.88)` brand navy |

### Brand asset integration

- `public/tricube-logo-square.jpg` (640×640, white bg) — Studio nav lockup + showcase header
- `public/tricube-logo-wide.png` (772×227, teal lockup) — login screen banner
- `public/tricube-logo-{512,192,32}.png` — favicon set; `__root.tsx` links `icon` (32/192) + `apple-touch-icon` (192)
- Login screen: `StudioAuth` in `StudioApp.tsx` — banner lockup, motto ("Learn. Build. Launch."), recessed email/password wells, brand-blue CTA; reached via Profile → Sign out

Typography, radii, spacing, motion and the SF Pro ladder are unchanged — the
retheme is a pure color/branding pass over the Apple structural tokens.

## LMS platform site (`/platform`) — flat minimalist system

Per the LMS product-website spec (§17–47), a second frontend lives at
`/platform` (`src/components/lms/`). Deliberately NOT neomorphic — flat,
premium, conversion-focused. Stack: React 19 + Tailwind v4 + Framer Motion
12 + lucide-react; Plus Jakarta Sans.

Palette (all AA-verified, `scripts/platform-contrast.mjs`):

| Role | Value | Usage |
|---|---|---|
| Primary surface | `#FFFFFF` | Backgrounds, cards, nav, modals |
| Warm neutral bg | `#F8F6F4` | Alternating sections |
| Warm hairline | `#E8E1DD` | Borders, dividers |
| Warm secondary text | `#6B625D` | Body copy (5.95:1; 5.52:1 on F8F6F4) |
| Primary text / dark sections | `#0E263A` | Headings, footer, CTA band |
| Interaction teal | `#2EA5A1` | Icons, progress, badges — decorative only (2.99:1) |
| Deep teal (text-bearing fills) | `#247F7C` → hover `#1D6865` | Buttons w/ white text (4.77:1) |
| Secondary blue | `#265CA0` | Links, secondary actions (6.73:1) |
| Light teal on navy | `#7DD8D5` | Labels inside dark cards (9.33:1) |

Motion tokens: `src/components/lms/motion.tsx` (`motionConfig`) — single
reveal ease `[0.22, 1, 0.36, 1]`, durations .2/.35/.65/.8, springs 350/28 and
hover 350/25. Primitives: `Reveal`, `MagneticButton` (8px max, pointer:fine +
reduced-motion gated), `AnimatedCounter`, `ProgressRing` (SVG pathLength).
Floats, magnets and carousel autoplay all disable under `prefers-reduced-motion`.

Sections: Navbar (frost-on-scroll + hide-on-scroll-down, spring 400/35) ·
Hero (stagger 0.12 + floating dashboard mock) · TrustedBy · Features ·
Benefits · CourseCatalog (4→2→scroll-snap mobile, category filter) ·
DashboardShowcase (scale reveal + staggered metrics) · HowItWorks ·
Testimonials (AnimatePresence carousel, 7s autoplay, pause-on-hover) ·
Pricing (layoutId toggle + AnimatePresence price swap) · FAQ (aria accordion) ·
CTA (navy band) · Footer (navy, staggered columns).

Verify: `node neomorphic-ui/scripts/platform-verify.mjs` against the dev
server — 15 live checks (sections, spec colors, toggle swap, accordion ARIA,
carousel advance, mobile overflow, site-chrome isolation).
