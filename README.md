# Zararsız Yaşam — meliszararsiz.com

Melis Zararsız'ın kişisel marka web sitesi: mindfulness temelli koçluk, yin yoga ve
meditasyon; kitap (*Kabuk*), yazılar ve buluşmalar. **Astro** ile statik site.

## Durum / Status
🚧 Geliştirme aşaması

- ✅ Astro projesi kuruldu (build doğrulandı, 119 sayfa)
- ✅ Ana sayfa — `src/pages/index.astro` (tasarım prototipinden taşındı; logo + "Yakında" Kabuk)
- ✅ Blog — 100 yazı `src/content/blog/`, liste + yazı + kategori sayfaları
- ⏳ Hakkımda / Birlikte Çalışalım / Buluşmalar / Kitap / İletişim — taslak sayfalar (içerik yakında)
- ⏳ Görsel kurtarma (Wayback) ve canlı yayına geçiş (deploy)

## Geliştirme / Development
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # statik çıktı -> dist/
```

## Yapı / Structure
```
src/
  pages/        index.astro, blog/, kategori/, hakkimda.astro, kitap.astro ...
  layouts/      BaseLayout.astro  (başlık + logo + alt bilgi, tüm sayfalar)
  content/blog/ 100 Markdown yazı
  styles/       global.css  (krem + bordo + zeytin tasarım sistemi)
public/
  assets/img/   logo.jpeg (eklenecek), fotoğraflar
  images/blog/  yazı görselleri (Wayback'ten kurtarılacak)
migration/      301 yönlendirme haritası, görsel listesi, rapor
docs/           prototype.html (ilk statik taslak, referans)
```

## Logo
`public/assets/img/logo.jpeg` gerekli — Google Drive `görseller/logo.jpeg` dosyasını
buraya kopyala. Beyaz arka plan, krem başlıkta `mix-blend-mode` ile gizleniyor.

## Yayın / Deploy
Astro statik dosya üretir (`dist/`), Alastyr (cPanel) köküne yüklenebilir. Build adımı
ve otomatik deploy bir sonraki adımda kurulacak (bkz. `migration/MIGRATION-REPORT.md`).

---
Alan adı & hosting: Alastyr · İletişim: ben@meliszararsiz.com
