# CLAUDE.md — Zararsız Yaşam (meliszararsiz.com)

Melis Zararsız'ın kişisel marka sitesi — mindfulness koçluğu, yin yoga,
meditasyon; *Kabuk* kitabının yazarı; podcast ve blog. Büyükada'da yaşıyor.
Geliştiren: Özgür Aslan (`ozgasl`, ozgur@akillifabrikalar.com.tr).

Akış: Melis geri bildirimini Özgür'e yazar → Özgür uygular → önizlemede
birlikte gözden geçirilir → canlıya alınır.

## Dil

- **Site içeriğinin tamamı Türkçe ve Türkçe kalacak.**
- Sayfa metinlerinde ziyaretçiye **resmî "siz"** diliyle hitap edilir.
- `src/content/blog/` altındaki 100 yazı **Melis'in kendi sesi — dokunulmaz**
  (dil/yazım düzeltmesi dahil).
- Özgür ile iletişim Türkçe. Melis'e yazılan notlarda samimi "sen" kullanılır.

## Tasarım dili

Sakin, kitabî, yavaş, anti-kurumsal. Krem `#F4EEE2`, bordo `#5C1F2A`, zeytin
`#5E5E44` (tam palet `src/styles/global.css` başındaki değişkenlerde).
Cormorant Garamond (başlık) + EB Garamond (metin). **Tailwind yok**, tek bir
düz CSS dosyası. **İnsan içeren yapay zekâ görseli kullanılmaz.**

## Teknik

- **Astro 4** statik site, SSR yok. `npm run dev` → 4321, `npm run build` →
  `dist/`. Temiz build **123 sayfa**.
- Astro 4 tuzağı: içerik koleksiyonlarında `entry.render()` kullanılır;
  `astro:content`'ten `render()` **import edilmez**.
- `prebuild` adımı `scripts/fetch-youtube.mjs` çalıştırır; dosya üretilemezse
  anasayfa sabit banner'a düşer, build kırılmaz.
- Bağımlılıklar: `astro`, `marked` (site metinlerindeki markdown için).
  `sharp` doğrudan bağımlı değil ama Astro'nun görsel motoruyla birlikte
  `node_modules`'te bulunur — tek seferlik görsel işleri için kullanılabilir.

### İçerik nerede duruyor

| Ne | Nerede | Melis panelden düzenler mi |
|---|---|---|
| Blog yazıları | `src/content/blog/*.md` | ✅ |
| Buluşma kutuları | `src/content/meetups/*.md` | ✅ |
| Duyurular (kayan bant) | `src/content/events/*.md` | ✅ |
| Sayfa metinleri | `src/data/site-metinleri.json` | ✅ |
| Kitap satış ayarları | `src/data/kitap-ayarlari.json` | ✅ |

Koleksiyon şemaları `src/content/config.ts`. JSON'lar `src/site.js` üzerinden
okunur; orada `md()` / `mdSatir()` (markdown → HTML) ve `gorsel()` yardımcıları
var. `gorsel()` `public/` içinde `<ad>@2x.<uzantı>` ve `.webp` varyantlarını
kendiliğinden bulup srcset üretir, piksel boyutunu dosya başlığından okur —
Melis panelden başka bir fotoğraf yüklerse varyant olmadan da çalışır.

**JSON alan adları `public/admin/config.yml` ile birebir aynı olmak zorunda.**
Birini değiştirirsen diğerini de değiştir.

### CMS

Sveltia CMS, `public/admin/config.yml`. OAuth relay bir Cloudflare Worker'da:
`zararsizyasam.ozgasl.workers.dev`. Melis'in GitHub hesabı: `blossomel`.

Panel bölümleri: Site Metinleri · Kitap Ayarları · Blog Yazıları · Duyurular ·
Buluşmalar.

- Sveltia **`editorial_workflow` desteklemiyor** (o Decap özelliği).
  `config.yml`'a eklemeye çalışma. Sonuç: **Melis'in kaydettiği her şey
  doğrudan `main`'e commit oluyor ve otomatik canlıya çıkıyor** — araya
  inceleme adımı girmiyor.
- Metin alanlarında `modes: ["raw", "rich_text"]` kullanılıyor. Sebep:
  Sveltia'nın zengin editörü Word'den yapıştırırken panodaki **görüntüyü**
  alıyordu; sade editör öntanımlı olunca metin olarak geliyor. Bunu geri alma.

### Yayın

- **Canlı:** Alastyr cPanel statik hosting, `deploy-production.yml` ile FTPS.
  Astro `base` = `/`. Domain meliszararsiz.com, SSL aktif.
  Eski WordPress URL'leri için `migration/redirects.htaccess` kuralları
  `public_html/.htaccess` içine eklenmiş olmalı.
- **Önizleme:** GitHub Pages, `deploy.yml`,
  `https://ozgasl.github.io/zararsiz_yasam/` (base `/zararsiz_yasam`).
  `claude/**` dallarından da deploy edebiliyor. Pages tek hedefe sahip, yani
  önizleme dalı main'in derlemesinin üstüne yazar — canlı Alastyr'da olduğu
  için sorun değil.
- **GA4:** `G-VX69C5SQB8`, sadece `meliszararsiz.com` / `www.meliszararsiz.com`
  hostname'inde yükleniyor; önizleme ve localhost ölçüme girmiyor.
- Repo: `ozgasl/zararsiz_yasam` (public).

## Dizin yapısı

```
src/pages/          index, blog/[...slug], blog/index, kategori/[category],
                    hakkimda, birlikte-calisalim (+3 alt sayfa), bulusmalar,
                    kitap, bonservisler, iletisim
src/layouts/        BaseLayout.astro (başlık+logo, alt bilgi, fontlar, GA4)
src/components/     Duyurular.astro (kayan bant)
src/content/        blog/ (100 yazı) · meetups/ · events/ · config.ts
src/data/           site-metinleri.json · kitap-ayarlari.json
                    (youtube-latest.json build'de üretilir, gitignore'da)
src/site.js         JSON okuma + markdown + görsel yardımcıları
src/utils.js        slugify (Türkçe karakter eşlemeli)
src/styles/         global.css
public/admin/       Sveltia config.yml + index.html
public/assets/img/  logo.png, ana sayfa portresi, buluşma ikonları, kapak
public/images/blog/ yazı görselleri (çoğu eksik — aşağı bak)
assets-kaynak/      yüksek çözünürlüklü kaynaklar + görsel notları (README.txt),
                    YAYINA GİRMEZ
migration/          redirects.htaccess, image-manifest.csv, posts-index.csv
scripts/            fetch-youtube.mjs, recover-images.mjs
docs/prototype.html ilk tek dosyalık tasarım prototipi (referans)
HANDOVER.md         Melis'e yönelik devir teslim dokümanı
```

## Çalışma şekli

1. **`main`'e Özgür'ün açık onayı olmadan push YAPMA.** Her iş
   `claude/site-updates-YYYY-MM` dalında yürür, onay gelince fast-forward.
2. Koda dokunmadan önce yapılandırılmış plan sun: *hemen yapılabilir /
   karar gerekiyor / Melis'ten bilgi bekleniyor*. Belirsiz maddede varsayım
   yapma, sor.
3. Her turda `npm run build` ile doğrula.
4. **Merge'e basmadan hemen önce `git fetch` yap.** Melis'in CMS kayıtları
   doğrudan `main`'e gidiyor; oturum başındaki senkron kontrolü merge anında
   eskimiş olabilir.
5. İşin sonunda Melis'e gönderilmek üzere Türkçe bir özet notu hazırla.

## Tuzaklar (önceki oturumlarda öğrenildi)

- Melis'in oluşturduğu duyuru dosya adlarında Türkçe karakter var
  (`melis-imza-günü.md`, `yürüyüş.md`). Duyuruların sayfası olmadığı için
  zararsız. Blog URL'leri front-matter'daki `slug` alanından geliyor, orada da
  risk yok. **`config.yml`'a `clean_accents`/`ascii` ekleme** — "ı" harfini
  düşürebilir.
- Kaydırmalı animasyonlar (IntersectionObserver) çapa hedeflerinin kaçmasına
  yol açıyordu; `window load` üzerinde `scrollIntoView` yeniden tetikleme +
  `setTimeout` yedeği ile çözüldü (`BaseLayout.astro`). Bozma.
- Playwright/tarayıcı ile ekran görüntüsü alacaksan animasyonların tetiklenmesi
  için sayfayı ~300px'lik adımlarla ~4500px'e kadar kaydırmak gerekiyor.
- **Logo iki dosya, ikisi de gerekli:** `logo.png` başlıkta (krem zemin),
  `logo-altbilgi.png` alt bilgide (bordo zemin). Sebebi: kaynak logonun beyaz
  zemini dışarıdan taşma-doldurma ile silinmiş, kapalı harf içleri opak beyaz
  kalmıştı — krem zeminde görünmüyor, bordoda beyaz leke oluyordu. Sadece
  şeffaflaştırmak yetmiyor, çünkü `ZARARSIZ`'ın koyu çizgileri bordoda 2,74:1'e
  düşüyor. Alt bilgi sürümünde o çizgilerin HSL açıklığı ters çevrildi →
  5,31:1. Ayrıntı ve ölçümler `assets-kaynak/README.txt` içinde.
  Tek dosyaya indirmeye çalışma; daha önce denenen `logo-light.png` her şeyi
  açtığı için daire ve ağaç soluyordu.

## Durum (Ağustos 2026)

- 100 blog yazısı eski WordPress veritabanından Markdown'a taşındı; slug'lar
  eski `/%postname%/` URL'lerinden korundu.
- Bölüm sayfalarının hepsi dolu (Hakkımda, Birlikte Çalışalım + 3 alt sayfa,
  Buluşmalar, Kitap, Bonservisler, İletişim).
- Sayfa metinleri ve kitap satış ayarları CMS'e taşındı — Melis hero cümlesini,
  alt bilgiyi ve bölüm girişlerini kendi değiştirebiliyor.
- **Kabuk henüz satışta değil.** `kitap-ayarlari.json` içindeki `satista_mi`
  kapalı; sitedeki tüm satın alma yerlerinde "Yakında" yazıyor. Melis anahtarı
  açıp mağaza linklerini girdiğinde kod değişikliği gerekmeden satışa geçer.

## Açık işler

1. **Blog görselleri** — yazılarda geçen ~222 görsel eski sunucudan silindi
   (`uploads` klasörü gitti). Markdown `/images/blog/<dosya>` gösteriyor.
   `node scripts/recover-images.mjs --check` Wayback'te arıyor; Wayback hız
   sınırı (HTTP 429) veriyor, `--delay=2600` ile çalıştır. Sonra `--download`,
   gerekirse `--top=10` / `--slug=x`. 90 yazıda 222 görsel var ama ilk 5 yazı
   bunların 63'ünü tutuyor — hepsini kurtarma, küratörlük yap. Alastyr
   cPanel'de JetBackup varsa oradan da bakılacak (Restore'a basılmayacak;
   indirip içinden sadece `wp-content/uploads` çıkarılacak).
2. **Bülten** — Melis'in kararı bekleniyor. Yazacaksa Kit/MailerLite hosted
   kayıt sayfası açacak, URL verilecek, sitedeki butonlar oraya bağlanacak
   (çift onay + KVKK rıza metni). Yazmayacaksa bülten dili siteden
   kaldırılacak. Geçtiği yerler: `kitap.astro`, `bulusmalar.astro`,
   `iletisim.astro` (SSS).
3. **Eski kişisel diyet/kilo yazıları** — Melis'in kendi tarihsel yazıları,
   olduğu gibi taşındı. Öne çıkarma vs. arşivleme **editoryal kararı onun**.

## Yapay zekâya repo yazma yetkisi

Melis "bana ve ChatGPT'ye tam yetki ver" diyor. Ayrıştırma:

- **Metin yazdırma:** ChatGPT bunu zaten yapıyor; Melis metni panele yapıştırır.
  Kurulum gerekmez.
- **Düzenlenebilir alanlar:** Gerçek engel buydu — Site Metinleri ve Kitap
  Ayarları ile çözüldü.
- **Repoya doğrudan yazma yetkisi:** şimdilik önerilmiyor. Melis'in kayıtları
  araya inceleme girmeden canlıya çıkıyor. Bozuk bir `.astro` düzenlemesi
  build'i düşürür — o durumda FTP deploy hiç çalışmadığı için canlı site son
  iyi hâlinde kalır (kazara oluşmuş bir güvenlik ağı), ama "geçerli ama yanlış"
  düzenlemeye karşı korumaz.
