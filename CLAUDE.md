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
- Logo: `public/assets/img/logo.png` — transparent-background version of `logo.jpeg`, used in header + footer via `BaseLayout.astro`. (No `mix-blend-mode` any more; it broke under browser-forced dark mode.) If the logo changes, regenerate both files.

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


## Content model & conventions (Aug 2026)

Three CMS collections, and only three. Melis maintains all of them at `/admin/`.

- **`blog`** — everything with photos, video, a story: articles *and* write-ups of
  meetups/signings that already happened. A meetup write-up gets the meetup's
  category (see below).
- **`meetups`** — the six descriptive boxes on `/bulusmalar/`. Text only, line
  icons, **no photos**, no sub-pages. Each entry carries a `category` field; when
  at least one blog post uses that category, the box grows a
  "Gerçekleşen buluşmalar (n) →" link to `/kategori/<slug>/`. That archive *is*
  the meetup's sub-page — there is no separate meetup detail route.
- **`events`** — labelled **"Duyurular"** in the panel. Feeds the scrolling band
  on the homepage (under the book panel) and on `/kitap/` via
  `src/components/Duyurular.astro`. Date + title + place + optional link, no
  body, **no page of its own**. Past-dated entries drop out automatically. With
  zero upcoming announcements the band renders nothing at all.

Other conventions:

- **Address the visitor with formal "siz"** in all page copy. The 100 migrated
  blog posts are Melis's own voice and are deliberately left untouched.
- Meetup content-file names must match their titles — they become the
  `/bulusmalar/#slug` anchors that the homepage cards link to.
- `icon` values must be unique across meetups: the homepage card photos in
  `public/assets/img/bulusmalar/` are mapped by icon key, so two entries sharing
  an icon means a duplicated photo.
- Markdown body fields are configured `modes: ["raw", "rich_text"]`. The plain
  editor is deliberately the default: Sveltia's rich text editor accepts pasted
  *images*, and Word puts a picture of the selection on the clipboard, so
  pasting from Word inserted a screenshot instead of text.
- `color-scheme: light` (meta tag + CSS) opts out of Chrome/Android auto-dark,
  which was inverting the cream palette on phones.
- `buyukada-melis.jpg` is a low-resolution source (396×607). It ships with a
  sharpened 2× companion via `srcset`; a genuine high-res original from Melis
  would still be a real improvement.
