// Build zamanında çalışır: kanalın herkese açık RSS beslemesinden (API anahtarı
// gerektirmez) en son videoyu çekip src/data/youtube-latest.json dosyasına yazar.
// homepage bu dosyayı okuyup son video küçük resmini gösterir.
//
// CHANNEL_ID ortam değişkeni tanımlı değilse ya da fetch başarısız olursa,
// script sessizce çıkar ve mevcut statik banner görseli kullanılmaya devam eder
// (index.astro fallback mantığı buna göre yazıldı).

import { writeFile, mkdir } from "node:fs/promises";

// Varsayılan kanal ID'si (gizli bir bilgi değil, workflow dosyasına dokunmadan
// buradan yönetiliyor). Gerekirse YOUTUBE_CHANNEL_ID ortam değişkeniyle ezilebilir.
const DEFAULT_CHANNEL_ID = "UCwGh-xc1-gED6d2D4pNq8mQ";
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID;
const OUT_DIR = new URL("../src/data/", import.meta.url);
const OUT_FILE = new URL("youtube-latest.json", OUT_DIR);

async function main() {
  if (!CHANNEL_ID) {
    console.log("[fetch-youtube] Kanal ID'si yok, atlanıyor (statik banner kullanılacak).");
    return;
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(CHANNEL_ID)}`;

  try {
    const res = await fetch(feedUrl, { headers: { "User-Agent": "zararsizyasam-build-bot/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    // İlk <entry> bloğunu al (feed en yeniden eskiye sıralıdır)
    const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
    if (!entryMatch) throw new Error("Feed içinde video bulunamadı");
    const entry = entryMatch[1];

    const videoId = (entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || [])[1];
    const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    const published = (entry.match(/<published>(.*?)<\/published>/) || [])[1];

    if (!videoId) throw new Error("videoId ayrıştırılamadı");

    const data = {
      videoId,
      title: title ? title.trim() : "",
      publishedAt: published || null,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      fetchedAt: new Date().toISOString(),
    };

    await mkdir(OUT_DIR, { recursive: true });
    await writeFile(OUT_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log(`[fetch-youtube] Son video bulundu: ${data.title} (${videoId})`);
  } catch (err) {
    console.warn(`[fetch-youtube] Çekilemedi. Sebep: ${err.message}`);
    console.warn("[fetch-youtube] Repodaki youtube-latest.json kullanılacak; yoksa sabit banner.");
    // Dosya yazılmaz ve SİLİNMEZ. src/data/youtube-latest.json repoda tutuluyor,
    // çünkü YouTube RSS akışı GitHub Actions IP'lerine 404 dönüyor (yerelden
    // 200 dönüyor — IP tabanlı bir kısıtlama, kanal kimliği ya da User-Agent
    // ile ilgisi yok, üçü de test edildi). Böylece canlı derleme son bilinen
    // videoyu basıyor. Dosya hiç yoksa index.astro try/catch ile sabit
    // banner'a düşer.
    // Kalıcı çözüm: YouTube Data API v3 anahtarı (GitHub secret) ya da
    // isteği Cloudflare Worker üzerinden geçirmek.
  }
}

await main();
