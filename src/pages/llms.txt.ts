import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { metinler, kitapAyarlari } from "../site.js";
import { slugify } from "../utils.js";

/**
 * /llms.txt — llmstxt.org biçiminde site haritası özeti.
 *
 * Elle yazılmıyor: metinler site-metinleri.json'dan, yazı ve buluşma listesi
 * içerik koleksiyonlarından geliyor. Melis panelden bir şey değiştirdiğinde ya
 * da yeni yazı eklediğinde bu dosya kendiliğinden güncelleniyor.
 */

// Markdown işaretlerini ve satır sonlarını tek satıra indirger.
const sade = (s: string | undefined) =>
  String(s ?? "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const kisalt = (s: string, n = 200) => {
  const t = sade(s);
  if (t.length <= n) return t;
  const kesik = t.slice(0, n);
  const bosluk = kesik.lastIndexOf(" ");
  return (bosluk > n * 0.6 ? kesik.slice(0, bosluk) : kesik) + "…";
};

export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const url = (yol: string) => new URL(`${base}${yol}`.replace(/\/{2,}/g, "/"), site).href;

  const ana = metinler.anasayfa;
  const yazilar = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  );
  const bulusmalar = (await getCollection("meetups", ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order
  );

  // Kategori sayıları — kategori arşiv sayfaları bu slug'larla üretiliyor
  const kategoriler = new Map<string, { ad: string; adet: number }>();
  for (const y of yazilar) {
    for (const k of y.data.categories ?? []) {
      const s = slugify(k);
      const mevcut = kategoriler.get(s);
      if (mevcut) mevcut.adet++;
      else kategoriler.set(s, { ad: k, adet: 1 });
    }
  }

  const satirlar: string[] = [];
  const yaz = (s = "") => satirlar.push(s);

  yaz("# Zararsız Yaşam — Melis Zararsız");
  yaz();
  yaz(`> ${kisalt(ana.hero_paragraf, 300)}`);
  yaz();
  yaz(
    "Melis Zararsız'ın kişisel sitesi. Mindfulness temelli koçluk, yin yoga ve " +
      "meditasyon alanlarında çalışıyor; *Kabuk* kitabının yazarı, podcast ve " +
      "blog üretiyor. Büyükada'da yaşıyor. Sitenin tamamı Türkçedir."
  );
  yaz();
  yaz(kisalt(ana.neden_metin, 400));
  yaz();

  yaz("## Sayfalar");
  yaz();
  yaz(`- [Anasayfa](${url("")}): ${kisalt(ana.hero_baslik, 120)}`);
  yaz(`- [Hakkımda](${url("hakkimda/")}): ${kisalt(metinler.hakkimda.lead, 180)}`);
  yaz(`- [Birlikte Çalışalım](${url("birlikte-calisalim/")}): ${kisalt(metinler.birlikte_calisalim.lead, 180)}`);
  yaz(`- [Buluşmalar](${url("bulusmalar/")}): ${kisalt(metinler.bulusmalar.lead, 180)}`);
  yaz(`- [Kitap: ${sade(metinler.kitap.baslik)}](${url("kitap/")}): ${kisalt(metinler.kitap.tanitim, 180)}`);
  yaz(`- [Bonservisler](${url("bonservisler/")}): Katılımcı ve danışan yorumları.`);
  yaz(`- [İletişim](${url("iletisim/")}): ${kisalt(metinler.iletisim.lead, 180)}`);
  yaz(`- [Blog](${url("blog/")}): ${yazilar.length} yazılık arşiv.`);
  yaz();

  yaz("## Çalışmalar");
  yaz();
  const HIZMET_YOLLARI = [
    "birlikte-calisalim/mindfulness-koclugu/",
    "birlikte-calisalim/yin-yoga/",
    "birlikte-calisalim/meditasyon/",
  ];
  HIZMET_YOLLARI.forEach((yol, i) => {
    const h = ana.hizmetler?.[i];
    if (h?.baslik) yaz(`- [${sade(h.baslik)}](${url(yol)}): ${kisalt(h.aciklama, 220)}`);
  });
  yaz();

  yaz("## Kitap");
  yaz();
  const durum = kitapAyarlari.satista_mi === true ? "Satışta." : "Henüz satışta değil.";
  yaz(`- [${sade(metinler.kitap.baslik)}](${url("kitap/")}): ${kisalt(metinler.kitap.hakkinda_metin, 300)} ${durum}`);
  yaz();

  if (bulusmalar.length) {
    yaz("## Buluşma türleri");
    yaz();
    for (const b of bulusmalar) {
      const kSlug = b.data.category ? slugify(b.data.category) : null;
      const adet = kSlug ? kategoriler.get(kSlug)?.adet ?? 0 : 0;
      const hedef = adet > 0 ? url(`kategori/${kSlug}/`) : url(`bulusmalar/#${b.slug}`);
      yaz(`- [${sade(b.data.title)}](${hedef})${adet > 0 ? `: ${adet} yazı` : ""}`);
    }
    yaz();
  }

  if (kategoriler.size) {
    yaz("## Blog kategorileri");
    yaz();
    for (const [s, k] of [...kategoriler.entries()].sort((a, b) => b[1].adet - a[1].adet)) {
      yaz(`- [${sade(k.ad)}](${url(`kategori/${s}/`)}): ${k.adet} yazı`);
    }
    yaz();
  }

  yaz("## Blog yazıları");
  yaz();
  yaz(`Tümü Melis Zararsız tarafından yazılmıştır, yeniden eskiye sıralı (${yazilar.length} yazı).`);
  yaz();
  for (const y of yazilar) {
    const tarih = new Date(y.data.date).toISOString().slice(0, 10);
    const kat = y.data.categories?.length ? ` — ${y.data.categories.map(sade).join(", ")}` : "";
    yaz(`- [${sade(y.data.title)}](${url(`blog/${y.slug}/`)}): ${tarih}${kat}`);
  }
  yaz();

  yaz("## İletişim");
  yaz();
  yaz(`- E-posta: ${sade(metinler.altbilgi.eposta)}`);
  yaz(`- Instagram: ${metinler.altbilgi.instagram_link}`);
  yaz(`- Podcast (Spotify): ${metinler.altbilgi.spotify_link}`);
  yaz(`- YouTube: ${metinler.altbilgi.youtube_link}`);
  yaz();

  return new Response(satirlar.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
