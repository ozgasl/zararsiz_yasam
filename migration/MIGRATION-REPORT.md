# Blog Aktarımı — Migration Report

Eski WordPress veritabanından (`meliszar_wp142.sql`) kurtarılan içerik, yeni site için
Markdown'a dönüştürüldü. Eski sitenin program dosyaları kayıptı; bu içerik **tamamen
veritabanından** kurtarıldı.

## Özet
- **100 yayınlanmış blog yazısı** → `src/content/blog/*.md`
- Her dosyada front-matter: `title`, `date`, `slug`, `categories`, `tags`, `legacyUrl`
- Kategori/etiket eşlemesi orijinal WordPress taksonomisinden korundu
- Tarih aralığı: 2017 – 2026

## Kategoriler
- Sağlıklı Yaşam — 69 yazı
- Yaşam Stili — 61 yazı
- Kişisel Gelişim — 51 yazı
- Kitap Önerisi — 22 yazı
- Yemek Tarifi — 16 yazı
- meditasyon — 14 yazı
- Etkinlik — 10 yazı
- yoga — 4 yazı
- Film Önerisi — 2 yazı
- öykü — 2 yazı
- koçluk — 2 yazı

## Dosyalar
- `src/content/blog/` — 100 Markdown yazısı (Astro content collection'a hazır)
- `migration/redirects.htaccess` — 301 yönlendirme haritası (eski `/slug/` → yeni `/blog/slug/`)
- `migration/image-manifest.csv` — yazılardaki 221 görselin orijinal URL listesi
- `migration/posts-index.csv` — tüm yazıların tarih/başlık/kategori dökümü

## Görseller (önemli not)
Yazılarda atıfta bulunulan **221 benzersiz görsel** sunucudaki `wp-content/uploads`
klasöründe değildi (silinmiş). Markdown içinde bu görseller `/images/blog/<dosya-adı>`
yoluna işaret edecek şekilde bırakıldı; böylece neyin eksik olduğu net.

Kurtarma planı: `image-manifest.csv`'deki URL'ler **Wayback Machine** (web.archive.org)
üzerinden çekilebilir. Hepsini değil — yazıyı gerçekten taşıyan görselleri seçerek
kurtarmak en verimlisi; metin ağırlıklı denemeler görselsiz de okunur.

## SEO / Yönlendirmeler
Eski permalink yapısı `/%postname%/` idi; yani her yazı `meliszararsiz.com/<slug>/`
adresindeydi ve Google bu adresleri indekslemiş durumda. İki seçenek:
1. **Önerilen:** Yeni sitede yazılar `/blog/<slug>/` altında; `redirects.htaccess`
   eski adresleri 301 ile yeni adreslere yönlendirir (SEO devri korunur).
2. **Alternatif:** Yazıları kökte (`/<slug>/`) tutmak — hiç yönlendirme gerekmez.
Yayına geçişte `redirects.htaccess` içeriği Alastyr'daki `public_html/.htaccess`
dosyasına eklenecek.

## Logo
Başlık ve alt bilgide Melis'in gerçek logosu (`assets/img/logo.jpeg`) kullanılıyor.
Logonun beyaz arka planı, açık krem zeminde `mix-blend-mode: multiply` ile görünmez
kılındı; koyu bordo alt bilgide ise krem bir "chip" içinde gösteriliyor.
**Yapılacak:** `görseller/logo.jpeg` dosyasını depodaki `assets/img/logo.jpeg`
konumuna kopyala (sende mevcut).
