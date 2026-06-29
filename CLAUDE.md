# CLAUDE.md — Zararsız Yaşam (meliszararsiz.com)

Personal-brand website for **Melis Zararsız** — mindfulness coaching, yin yoga,
meditation; author of *Kabuk*; podcast & blog. Built by Özgür (developer friend).

## Stack
- **Astro** static site (no SSR). `npm run dev` → localhost:4321, `npm run build` → `dist/`.
- Blog uses Astro **content collections** (`src/content/blog/*.md`, schema in `src/content/config.ts`).
- Plain CSS design system in `src/styles/global.css` (no Tailwind).

## Conventions
- **Site content is Turkish.** UI strings, page copy, slugs — all Turkish. Keep it that way.
- Design palette: cream `#F4EEE2`, deep wine/burgundy, olive. Fonts: Cormorant Garamond (display) + EB Garamond (body). Tone: calm, bookish, slow, anti-corporate. No AI-generated images of people.
- Logo lives at `public/assets/img/logo.jpeg` (vertical lockup, near-white bg removed via `mix-blend-mode`). Used in header + footer via `BaseLayout.astro`.

## Structure
```
src/pages/        index.astro, blog/index.astro, blog/[...slug].astro,
                  kategori/[category].astro, hakkimda/birlikte-calisalim/
                  bulusmalar/kitap/iletisim .astro (stubs)
src/layouts/      BaseLayout.astro  (header+logo, footer, fonts — all pages)
src/content/blog/ 100 Markdown posts (recovered from old WordPress DB)
src/styles/       global.css
public/assets/img/ logo + 3 photos
public/images/blog/ post images (MOSTLY MISSING — see below)
migration/        redirects.htaccess, image-manifest.csv, posts-index.csv, MIGRATION-REPORT.md
docs/prototype.html  original single-file design prototype (reference)
```

## State (done)
- Astro scaffold builds clean (~119 pages: 100 posts + 12 category pages + blog index + homepage + 5 stubs).
- 100 blog posts migrated from old WordPress DB to Markdown with front-matter
  (title, date, categories, tags, legacyUrl). Slugs preserved from old `/%postname%/` URLs.
- Kabuk (book) shows a **"Yakında"** pill — NOT on sale yet, no purchase button.
- Logo wired into header/footer.

## TODO / pending
1. **Deploy** — currently local-only by choice. Production target is **Alastyr (cPanel) static hosting at the domain root**, so Astro `base` stays `/`. GitHub Pages was abandoned (it can't build Astro, and it serves at a `/zararsiz_yasam/` subpath which conflicts with the root-absolute links). When deploying: upload `dist/` to `public_html`, and append `migration/redirects.htaccess` rules to `public_html/.htaccess` so old `/slug/` URLs 301 to `/blog/slug/`.
2. **Post images** — ~221 unique images referenced in posts are GONE from the old server (uploads folder was deleted). Markdown points them at `/images/blog/<file>`. Recover the important ones from the **Wayback Machine** using `migration/image-manifest.csv` (curate, don't restore all). Text-only posts read fine without images.
3. **Section pages** — Hakkımda, Birlikte Çalışalım, Buluşmalar, Kitap, İletişim are stubs; fill with real content (Birlikte Çalışalım / Buluşmalar / Kitap carry "Yakında").
4. Some older posts are personal weight-loss/diet essays — Melis's own historical writing; migrated as-is. Editorial call (feature vs. archive) is hers.

## Hosting facts
- Alastyr cPanel, domain meliszararsiz.com, SSL active. One DB (old WordPress, prefix `wps6_`) — content already rescued. Live site currently shows a "Site yenileniyor" placeholder only.
