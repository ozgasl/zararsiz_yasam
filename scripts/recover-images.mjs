#!/usr/bin/env node
/**
 * Eski blog görsellerini Wayback Machine'den kurtarma aracı.
 *
 * Eski sunucudaki wp-content/uploads klasörü silindi; 221 görsel kayıp.
 * migration/image-manifest.csv bu görsellerin ESKİ adreslerini tutuyor.
 * Bu script o adresleri web.archive.org'da arar, bulduklarını indirir.
 *
 * KULLANIM (repo kökünden, internet bağlantısı gerekir):
 *
 *   node scripts/recover-images.mjs --check
 *       Hiçbir şey indirmez. Sadece "kaç tanesi arşivde var" raporu çıkarır.
 *       Sonuç: migration/image-recovery-report.csv
 *
 *   node scripts/recover-images.mjs --download
 *       Arşivde bulunanları public/images/blog/ içine indirir.
 *
 *   node scripts/recover-images.mjs --download --slug=yogaya-basliyorum
 *       Sadece tek bir yazının görsellerini indirir (önce bunu denemek iyi olur).
 *
 *   node scripts/recover-images.mjs --download --top=10
 *       En çok görsel içeren 10 yazıyla sınırlar (küratörlük için).
 *
 * NOT: Wayback API'si yavaş ve zaman zaman hata verir. Script istekler arasında
 * bekler ve başarısız olanları tekrar dener; 221 görsel için --check yaklaşık
 * 4-6 dakika sürer. Yarıda kesilirse tekrar çalıştırmak güvenli: zaten inmiş
 * dosyaları atlar.
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST = path.join(ROOT, "migration", "image-manifest.csv");
const OUT_DIR = path.join(ROOT, "public", "images", "blog");
const REPORT = path.join(ROOT, "migration", "image-recovery-report.csv");

const args = process.argv.slice(2);
const flag = (name) => args.some((a) => a === `--${name}`);
const value = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : null;
};

const DOWNLOAD = flag("download");
const ONLY_SLUG = value("slug");
const TOP = value("top") ? Number(value("top")) : null;
const DELAY_MS = Number(value("delay") ?? 900);

if (!DOWNLOAD && !flag("check")) {
  console.error("Kullanım: node scripts/recover-images.mjs --check | --download [--slug=x] [--top=N]");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseCsv(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const cols = header.split(",");
  return lines
    .filter(Boolean)
    .map((line) => {
      // manifest'te virgül içeren alan yok, basit split yeterli
      const parts = line.split(",");
      return Object.fromEntries(cols.map((c, i) => [c, parts[i]]));
    });
}

/** Wayback availability API: bu adresin arşivlenmiş bir kopyası var mı? */
async function findSnapshot(url, attempt = 0) {
  const api = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
  try {
    const res = await fetch(api, { headers: { "User-Agent": "zararsiz-yasam-image-recovery" } });
    if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const snap = data?.archived_snapshots?.closest;
    return snap?.available ? snap : null;
  } catch (err) {
    if (attempt < 2) {
      await sleep(2500 * (attempt + 1));
      return findSnapshot(url, attempt + 1);
    }
    throw err;
  }
}

/** id_ eki: Wayback'in kendi arayüz/banner katmanını atlayıp ORİJİNAL baytları verir. */
function rawUrl(snapshot) {
  return snapshot.url.replace(/\/web\/(\d+)\//, "/web/$1id_/");
}

async function download(snapshot, destPath) {
  const res = await fetch(rawUrl(snapshot), {
    headers: { "User-Agent": "zararsiz-yasam-image-recovery" },
  });
  if (!res.ok) throw new Error(`indirme başarısız: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // 1 KB'den küçük dosyalar genelde hata sayfasıdır, görsel değil
  if (buf.length < 1024) throw new Error(`dosya çok küçük (${buf.length} bayt), atlandı`);
  await fs.writeFile(destPath, buf);
  return buf.length;
}

const rows = parseCsv(await fs.readFile(MANIFEST, "utf8"));

// --top=N: en çok görsel içeren yazıları önceliklendir
let selected = rows;
if (ONLY_SLUG) {
  selected = rows.filter((r) => r.slug === ONLY_SLUG);
  if (!selected.length) {
    console.error(`"${ONLY_SLUG}" manifest'te yok. Örnek slug: ${rows[0].slug}`);
    process.exit(1);
  }
} else if (TOP) {
  const counts = new Map();
  for (const r of rows) counts.set(r.slug, (counts.get(r.slug) ?? 0) + 1);
  const keep = new Set(
    [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, TOP).map(([slug]) => slug)
  );
  selected = rows.filter((r) => keep.has(r.slug));
}

if (DOWNLOAD) await fs.mkdir(OUT_DIR, { recursive: true });

console.log(`${selected.length} görsel kontrol edilecek (mod: ${DOWNLOAD ? "indirme" : "sadece kontrol"})\n`);

const report = [];
let found = 0, missing = 0, saved = 0, skipped = 0, failed = 0;

for (const [i, row] of selected.entries()) {
  const filename = path.basename(row.local);
  const dest = path.join(OUT_DIR, filename);
  const label = `[${i + 1}/${selected.length}] ${filename}`;

  if (DOWNLOAD) {
    try {
      await fs.access(dest);
      console.log(`${label} — zaten var, atlandı`);
      report.push({ ...row, filename, status: "zaten_var", snapshot: "" });
      skipped++;
      continue;
    } catch {
      /* dosya yok, devam */
    }
  }

  // http:// ve https://, www'li ve www'suz varyantları dene
  const variants = [
    row.original_url,
    row.original_url.replace("http://", "https://"),
    row.original_url.replace("://www.", "://"),
  ].filter((v, idx, arr) => arr.indexOf(v) === idx);

  let snapshot = null;
  try {
    for (const v of variants) {
      snapshot = await findSnapshot(v);
      if (snapshot) break;
      await sleep(250);
    }
  } catch (err) {
    console.log(`${label} — API hatası: ${err.message}`);
    report.push({ ...row, filename, status: "api_hatasi", snapshot: "" });
    failed++;
    await sleep(DELAY_MS);
    continue;
  }

  if (!snapshot) {
    console.log(`${label} — arşivde YOK`);
    report.push({ ...row, filename, status: "arsivde_yok", snapshot: "" });
    missing++;
    await sleep(DELAY_MS);
    continue;
  }

  found++;
  if (!DOWNLOAD) {
    console.log(`${label} — arşivde var (${snapshot.timestamp})`);
    report.push({ ...row, filename, status: "arsivde_var", snapshot: snapshot.url });
  } else {
    try {
      const bytes = await download(snapshot, dest);
      console.log(`${label} — indirildi (${Math.round(bytes / 1024)} KB)`);
      report.push({ ...row, filename, status: "indirildi", snapshot: snapshot.url });
      saved++;
    } catch (err) {
      console.log(`${label} — ${err.message}`);
      report.push({ ...row, filename, status: "indirme_hatasi", snapshot: snapshot.url });
      failed++;
    }
  }

  await sleep(DELAY_MS);
}

const csv = [
  "slug,original_url,local,filename,status,snapshot",
  ...report.map((r) => [r.slug, r.original_url, r.local, r.filename, r.status, r.snapshot].join(",")),
].join("\n");
await fs.writeFile(REPORT, csv, "utf8");

console.log(`
------------------------------------------
Arşivde bulundu : ${found}
Arşivde yok     : ${missing}
${DOWNLOAD ? `İndirildi       : ${saved}\nZaten vardı     : ${skipped}\n` : ""}Hata            : ${failed}

Rapor: migration/image-recovery-report.csv
${DOWNLOAD ? "\nİndirilen dosyaları gözden geçir: bazıları Wayback'in küçültülmüş\n(thumbnail) sürümü olabilir. Kalitesi kötü olanları silmek en iyisi." : "\nİndirmek için aynı komutu --download ile çalıştır."}
------------------------------------------`);
