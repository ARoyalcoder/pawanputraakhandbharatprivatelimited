# Pawan Putra Akhand Bharat Pvt. Ltd. (PPAB) website

**Powering Security, Connectivity & Growth.** The public website for PPAB's five divisions (Secure, Connect, Solar, Digital and Space), plus the existing lead API and admin console.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · daisyUI 5 · GSAP 3 (ScrollTrigger, SplitText) · Lenis · Three.js / React Three Fiber / drei · Spline (optional) · React Hook Form + Zod 4 · Vitest · pnpm

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm build` / `pnpm start` | Production build (all public pages are statically prerendered) and server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `pnpm test` | Vitest: content integrity, schemas, lead API, SEO, media manifest, UI components, backend |
| `pnpm a11y [url]` | axe-core audit of every public page (run against `pnpm start`, default `http://localhost:3200`) |
| `pnpm images` | Status of the AI concept images; `pnpm images --missing` prints prompts for the missing ones |

## Where things live

```text
app/(site)/          Public pages: home, about, solutions/*, industries/*, projects/*, why-us, blog/*, contact, legal
app/admin, app/api   Admin console and API routes (lead intake: POST /api/leads)
components/
  ui/                Button, Section/Container, SectionHeading/Eyebrow, Badge, Accordion, Breadcrumbs, Icon, Logo, CornerFrame
  layout/            TopUtilityBar, SiteFooter, PageHero, FloatingContact, MobileActionBar
  navigation/        SiteHeader, DesktopNav (mega dropdowns), MobileNav (<dialog> drawer)
  animation/         MotionProvider, SmoothScroll (Lenis), Reveal / Parallax
  3d/                CanvasWrapper, ThreeScene, SplineScene, CameraController, DeviceCapability, fallbacks, scenes/*
  media/             AIImage, AIImageView, ConceptArt (+ concept/*), OptimizedImage, HeroImage, ResponsiveImage, BackgroundImage, VideoBackground
  forms/             Six lead forms, fields, QuoteProvider (site-wide dialog), LeadFormTabs, zodResolver
features/            Division visualisations (network flow, energy flow, digital ecosystem, space journey), industries, projects, blog, why-us, process, faq
sections/            Homepage sections and the shared FinalCta
data/                Divisions, industries, company copy, FAQ, navigation, projects, testimonials
content/             image-prompts.ts: AI imagery manifest and prompts
config/site.config.ts  Verified company details (contact, offices)
lib/                 animations, seo, validations, media, contact helpers, cms, db, security
styles/globals.css   Design tokens (@theme), daisyUI themes, utilities
```

Content is data-driven. To change a service, tagline, FAQ or industry, edit `data/`; every page that uses it updates.

## Design system

- **Palette:** PPAB navy (`navy-900 #06152F`, `navy-950 #020B1D`, `navy-800 #0B2347`) and gold (`gold-500 #D8A62A`, `gold-300 #F4C95D`), with one restrained accent per division (Secure teal, Connect blue, Solar amber, Digital violet, Space bronze).
- **Type:** Manrope (display and body), Instrument Serif italic for gold accent phrases (`<em>` inside headings), JetBrains Mono for micro-labels. Fluid scale: `text-display`, `text-h1`…`text-h4`, `text-body-lg`, `text-body`, `text-small`, `text-caption`, `text-button`.
- **Motifs:** the gold hairline eyebrow from the logo lockup, blueprint grids on dark sections, viewfinder corner brackets on media.
- **Surfaces:** dark cinematic sections (`Section tone="dark|darker"`, which also switches daisyUI to the `ppab-night` theme) alternate with light editorial ones.
- **Motion:** sections stay server components and opt in with `data-reveal="up|fade|scale|left|right|mask"`, `data-parallax="0.15"` and `data-split` (line-masked headings). `MotionProvider` wires these up with GSAP ScrollTrigger. Content is visible without JavaScript, and a 4s failsafe reveals everything if the animation runtime never starts. `prefers-reduced-motion` disables all motion, including 3D and auto-advancing tabs.

## 3D

`ThreeScene` renders a Spline scene when a URL is configured, otherwise a React Three Fiber scene. Scenes are code-split and mount only near the viewport. They pause off screen and fall back to static concept art on error, on a lost WebGL context, or when the device tier is `OFF`.

| Tier | When | Settings |
| --- | --- | --- |
| HIGH | ≥1280px, fine pointer | DPR up to 2, antialias, 900 particles, environment lighting |
| MEDIUM | tablets / touch laptops | DPR up to 1.5, 420 particles |
| LOW | <768px | DPR 1, no antialias, 160 particles, no environment |
| OFF | no WebGL, low power / save-data, reduced motion | static illustration |

Scenes: homepage hero (PPAB core with orbiting division models), Secure (a CCTV camera that follows the pointer), Space (plot → design → construction → interior → finished). Environment flags: `NEXT_PUBLIC_ENABLE_3D`, `NEXT_PUBLIC_3D_QUALITY` (`auto` or a tier), and `NEXT_PUBLIC_SPLINE_{HERO,SECURE,SPACE}_URL`.

## AI imagery

All conceptual imagery is listed in `content/image-prompts.ts`, one entry per image with its filename, prompt, alt text and `illustrative: true`. Until a file exists in `public/images/ai/`, the site renders a matching built-in line-art illustration, so no layout is ever empty. Generated images are labelled "Illustrative concept".

1. Run `pnpm images --missing` to get the prompts.
2. Generate each image, export as WebP at the listed size, and save it to the listed path.
3. Rebuild.

**Never use AI imagery for projects.** Project records (`data/projects.ts`) require verification details and real photography, which the tests enforce.

## Content and trust rules

These are enforced by `tests/content-integrity.test.ts`:

- Contact details, offices and taglines come only from PPAB collateral (see `public/images/posters`) and the project brief.
- Division service lists match the brief exactly; extra offerings printed on PPAB's posters are listed as "Also available".
- Industries only recommend services a division actually offers.
- No statistics, certifications, "24/7", "PAN India", awards or guarantees anywhere in the UI.
- `data/projects.ts` and `data/testimonials.ts` are intentionally empty. Their pages show verification notices until genuine, approved entries are added.

## Leads

Every form posts to `POST /api/leads` with the same Zod schema used on the client (`lib/validations/lead.schema.ts`). Spam protection: an off-screen honeypot field, a client-measured minimum fill time, and IP rate limiting. A successful submission returns a reference ID and a pre-filled WhatsApp continuation link.

## Open items

- **Figma:** the supplied prototype is private, so the design could not be compared against it. Share view access and the tokens in `styles/globals.css` can be aligned.
- **Legal pages:** Privacy Policy and Terms are conservative drafts. Have them reviewed before launch.
- **Admin authentication** is being hardened in a separate task (see the "Secure lead and admin API authentication" session).
- **Legacy tests:** `tests/legacy-files.mjs` lists tests written for the previous frontend. They are excluded from all tooling and can be deleted.
- **Content to supply:** verified projects with photos, consented testimonials, social profile URLs, and AI images.
