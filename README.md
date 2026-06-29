# Zararsız Yaşam — meliszararsiz.com

Melis Zararsız'ın kişisel marka web sitesi: mindfulness temelli koçluk, yin yoga ve
meditasyon çalışmalarını; kitap, yazılar ve buluşmaları bir araya getiren sade, modern
ve uzun ömürlü bir dijital alan.

> Personal brand website for Melis Zararsız (mindfulness-based coaching, yin yoga,
> meditation), plus her book, writing and community meetups.

## Durum / Status

🚧 **Geliştirme aşaması / In development**

Şu an depoda ana sayfanın çalışan bir ilk taslağı (prototip) bulunuyor. Brief'lerdeki
yön — bej + bordo + zeytin paleti, kitapçı/yazı masası hissi, gerçek fotoğraflar —
birebir takip edildi.

- ✅ Ana Sayfa (prototip) — `index.html`
- ⏳ Hakkımda
- ⏳ Birlikte Çalışalım
- ⏳ Buluşmalar
- ⏳ Blog Yazıları + arşiv/kategori sayfaları
- ⏳ Kitap (Kabuk)
- ⏳ İletişim

## Önizleme / Preview

`index.html` tek başına çalışan bir dosyadır — tarayıcıda açmanız yeterli.
(`index.html` is fully self-contained; just open it in a browser.)

Canlı bağlantı paylaşmak için **GitHub Pages**'i açabilirsiniz:
`Settings → Pages → Source: Deploy from a branch → main / root`. Birkaç dakika içinde
site şu adreste yayına girer:

```
https://ozgasl.github.io/zararsiz_yasam/
```

## Notlar / Notes

- **Logo:** Şimdilik başlıktaki logo, CSS/SVG ile yapılmış geçici bir kelime-marka.
  Melis'in JPEG logosunun arka planı beyaz olduğu için doğrudan kullanılmadı;
  şeffaf bir PNG geldiğinde değiştirilecek.
- **Fotoğraflar:** Hero (Büyükada portresi), Kabuk kapağı ve "Merhaba ben Melis"
  bölümündeki kareler Melis'in kendi görselleridir (`assets/img/`). Blog ve buluşma
  kartlarındaki görseller şimdilik yer tutucudur — gerçek fotoğraflar beklenmektedir.
  Brief gereği yapay zekâ ile üretilmiş insan görseli kullanılmamaktadır.

## Sonraki adım / Next step

Statik prototipin **Astro** tabanlı bir yapıya taşınması (blog koleksiyonları, içerik
yönetimi için hafif bir CMS, diğer altı sayfa ve SEO/şema altyapısı). WordPress
arşivinin aktarımı ve 301 yönlendirmeleri için mevcut sitenin yedeği gerekecek.

---

Alan adı & hosting: Alastyr · İletişim: ben@meliszararsiz.com
