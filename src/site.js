/**
 * Site metinleri ve kitap satış ayarları.
 *
 * Bu iki JSON dosyası Sveltia panelindeki "Site Metinleri" ve "Kitap Ayarları"
 * kayıtlarıdır. Melis panelden değiştirince sayfalar da değişir; metinler artık
 * .astro dosyalarının içinde gömülü değil.
 *
 * Alan adları config.yml ile birebir aynı olmak zorunda. Bir alanı yeniden
 * adlandırırsan public/admin/config.yml içindeki karşılığını da düzelt.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

export { default as metinler } from "./data/site-metinleri.json";
export { default as kitapAyarlari } from "./data/kitap-ayarlari.json";

marked.use({ gfm: true, breaks: false });

// Dış siteye giden linkler yeni sekmede açılsın (site içi linkler aynı sekmede).
marked.use({
  renderer: {
    link(token) {
      const href = token.href ?? "";
      const govde = this.parser.parseInline(token.tokens ?? []);
      const baslik = token.title ? ` title="${token.title}"` : "";
      const disari = /^https?:\/\//i.test(href);
      const ek = disari ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${href}"${baslik}${ek}>${govde}</a>`;
    },
  },
});

/** Çok paragraflı metni HTML'e çevirir (set:html ile basılır). */
export function md(text) {
  if (!text) return "";
  return marked.parse(String(text)).trim();
}

/**
 * Tek satırlık metni HTML'e çevirir ama <p> ile sarmalamaz.
 * Zaten bir <p> ya da <h1> içine basılacak alanlar için.
 */
export function mdSatir(text) {
  if (!text) return "";
  return marked.parseInline(String(text)).trim();
}

/* ---------- public/ içindeki görseller ---------- */

const PUBLIC_DIR = join(process.cwd(), "public");

/** JPEG / PNG / WebP başlığından piksel boyutunu okur. Okuyamazsa null. */
function boyutOku(buf) {
  // PNG: 8 baytlık imza + IHDR
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // WebP: RIFF....WEBP
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const tur = buf.toString("ascii", 12, 16);
    if (tur === "VP8 ") {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (tur === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (tur === "VP8X") {
      return {
        width: (buf.readUIntLE(24, 3) & 0xffffff) + 1,
        height: (buf.readUIntLE(27, 3) & 0xffffff) + 1,
      };
    }
    return null;
  }
  // JPEG: SOF0..SOF15 işaretçisini ara (SOF4/8/12 hariç)
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const isaret = buf[i + 1];
      if (isaret >= 0xc0 && isaret <= 0xcf && isaret !== 0xc4 && isaret !== 0xc8 && isaret !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

const bilgiOnbellek = new Map();

function dosyaBilgisi(publicYol) {
  if (bilgiOnbellek.has(publicYol)) return bilgiOnbellek.get(publicYol);
  let sonuc = null;
  try {
    // Sadece ilk 64 KB yeterli; boyut bilgisi dosya başında.
    sonuc = boyutOku(readFileSync(join(PUBLIC_DIR, publicYol.replace(/^\//, ""))));
  } catch {
    sonuc = null;
  }
  bilgiOnbellek.set(publicYol, sonuc);
  return sonuc;
}

/**
 * CMS'ten gelen bir görsel yolu için <picture> verisi üretir.
 *
 * Aynı klasörde <ad>@2x.<uzantı> ve/veya <ad>.webp + <ad>@2x.webp varsa
 * bunlar kendiliğinden srcset'e eklenir; yoksa sade bir <img> basılır.
 * Böylece Melis panelden başka bir fotoğraf yüklediğinde de bozulmaz.
 *
 * @param {string} yol  "/assets/img/foo.jpg" gibi public/ altındaki yol
 * @param {string} base import.meta.env.BASE_URL
 */
export function gorsel(yol, base = "/") {
  const temiz = String(yol || "").replace(/^\//, "");
  const nokta = temiz.lastIndexOf(".");
  const govde = nokta === -1 ? temiz : temiz.slice(0, nokta);
  const uzanti = nokta === -1 ? "" : temiz.slice(nokta);

  const url = (p) => `${base}${p}`;
  const varMi = (p) => dosyaBilgisi(`/${p}`) !== null;

  const retina = `${govde}@2x${uzanti}`;
  const webp = `${govde}.webp`;
  const webpRetina = `${govde}@2x.webp`;

  const boyut = dosyaBilgisi(`/${temiz}`);

  const srcset = varMi(retina) ? `${url(temiz)} 1x, ${url(retina)} 2x` : null;
  let webpSrcset = null;
  if (varMi(webp)) {
    webpSrcset = varMi(webpRetina) ? `${url(webp)} 1x, ${url(webpRetina)} 2x` : `${url(webp)} 1x`;
  }

  return {
    src: url(temiz),
    srcset,
    webpSrcset,
    width: boyut?.width ?? null,
    height: boyut?.height ?? null,
  };
}
