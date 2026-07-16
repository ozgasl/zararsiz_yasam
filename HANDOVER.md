# Zararsız Yaşam (meliszararsiz.com) — Proje Devir Teslim Dokümanı

**Hazırlanma tarihi:** Temmuz 2026
**Hazırlayan:** Özgür Aslan (geliştirici)
**Kime:** Melis Zararsız

Bu doküman, sitenin nasıl çalıştığını, hangi servislere bağlı olduğunu ve
gerektiğinde kime/nereye bakılması gerektiğini tek yerde toplar. Kimlik
bilgisi/şifre alanları **bilerek boş bırakıldı** — Özgür bunları elle
dolduracak. Bu dosyayı güvenli bir yerde (parola yöneticisi, özel bir not,
vb.) saklayın; genel/paylaşılan bir yere koymayın çünkü doldurulduktan sonra
hassas bilgiler içerecek.

---

## 1. Proje özeti

- **Site:** meliszararsiz.com — Melis Zararsız'ın kişisel marka sitesi
  (mindfulness koçluğu, yin yoga, meditasyon, *Kabuk* kitabı, podcast, blog).
- **Teknoloji:** [Astro](https://astro.build) ile statik site — veritabanı
  yok, sunucuda çalışan bir program yok, sadece düz HTML/CSS/JS dosyaları.
- **İçerik yönetimi:** [Sveltia CMS](https://sveltiacms.app) — tarayıcıdan
  giriş yapıp blog yazısı/fotoğraf eklemeyi sağlayan panel.
- **Barındırma:** Alastyr (cPanel), FTPS ile otomatik yükleme.
- **Otomasyon:** Her onaylanan değişiklik GitHub üzerinden otomatik olarak
  build edilip Alastyr'a yükleniyor — elle dosya taşıma gerekmiyor.

---

## 2. Genel akış (kim, ne zaman, ne oluyor)

```
Melis (/admin/ üzerinden giriş yapar)
   │  yeni yazı yazar / fotoğraf yükler / "Taslak" kutusunu işaretler ya da kaldırır
   ▼
GitHub deposu (içerik buraya commit olarak kaydedilir)
   │  her push otomatik olarak şunu tetikler:
   ▼
GitHub Actions ("Alastyr Canlı Yayın" iş akışı)
   │  siteyi yeniden build eder (Astro) ve FTPS ile yükler
   ▼
Alastyr / public_html (canlı site — birkaç dakika içinde güncellenir)
```

**Önemli:** Sveltia CMS'in "editorial workflow" (taslak → inceleme → onay)
özelliği **henüz desteklenmiyor** (CMS'in kendi ekibi bunu ileride
ekleyeceğini söylüyor, şu an yok). Yani Melis bir yazıyı "Taslak" kutusu
işaretli olmadan kaydederse, **doğrudan ve otomatik olarak canlıya çıkar** —
aradan geçen bir onay adımı yok. Tek güvenlik önlemi: her yazıda
"Taslak (yayınlanmasın)" kutusu var; işaretliyken o yazı sitede hiç
görünmez, siteye hazır olduğunda kutuyu kaldırıp tekrar kaydetmek yeterli.

---

## 3. Melis için: içerik nasıl eklenir?

1. Tarayıcıdan **meliszararsiz.com/admin/** adresine gidin.
2. **"Sign In with GitHub"** ile giriş yapın (GitHub hesabınızla).
3. Sol menüden **"Blog Yazıları"** → sağ üstten **"New Blog Yazısı"**.
4. Başlık, tarih, kategori, etiket alanlarını doldurun.
5. **İçerik** kutusunda yazınızı yazın; fotoğraf eklemek için araç
   çubuğundaki resim simgesine tıklayıp bilgisayarınızdan/telefonunuzdan
   seçin — otomatik olarak yüklenir.
6. Yazı hazır değilse **"Taslak (yayınlanmasın)"** kutusunu işaretli
   bırakın (varsayılan olarak zaten işaretli gelir).
7. Sağ üstten **Save**'e basın.
8. Yazıyı yayınlamaya hazır olduğunuzda tekrar açın, "Taslak" kutusunu
   kaldırın, tekrar Save'e basın. 2-3 dakika içinde site güncellenir.

---

## 4. Depo (Repository)

- **Adres:** `github.com/ozgasl/zararsiz_yasam` *(devir teslim sonrası:
  `github.com/blossomel/zararsiz_yasam` olabilir — bkz. §8)*
- **Ana dal:** `main`
- **Yapı:**
  - `src/content/blog/` — tüm blog yazıları (Markdown)
  - `src/pages/` — sayfalar (anasayfa, buluşmalar, kitap, iletişim, vb.)
  - `src/styles/global.css` — tüm görsel tasarım (renk, yazı tipi, vb.)
  - `public/admin/` — Sveltia CMS ayar dosyaları
  - `public/assets/img/`, `public/images/blog/` — görseller
  - `.github/workflows/` — otomatik build/deploy tanımları

---

## 5. Barındırma — Alastyr (cPanel)

- **Domain:** meliszararsiz.com
- **Gerçek web kökü (document root):** `/home/meliszararsiz/public_html`
  *(cPanel'de birden fazla klasör olabilir — canlı site her zaman bu
  klasörden servis edilir)*
- **FTP hesabı:** `ozgasl@meliszararsiz.com` — dizini doğrudan `public_html`
  olacak şekilde oluşturuldu (projede bu konuda bir karışıklık yaşandı,
  bkz. §7 "Öğrenilenler").

**cPanel giriş bilgileri:**
- cPanel adresi: `______________________________`
- Kullanıcı adı: `______________________________`
- Şifre: `______________________________`

**FTP bilgileri (GitHub Secrets içinde de kayıtlı, bkz. §6):**
- FTP sunucu: `ftp.meliszararsiz.com`
- FTP kullanıcı adı: `ozgasl@meliszararsiz.com`
- FTP şifresi: `______________________________`

---

## 6. Otomatik yayına alma (GitHub Actions)

- **Dosya:** `.github/workflows/deploy-production.yml`
- **Ne zaman çalışır:** `main` dalına her push/merge olduğunda
- **Ne yapar:** `npm run build` ile siteyi derler, FTPS (port 21) ile
  `public_html`'e yükler
- **Gerekli GitHub Secrets** (repo → Settings → Secrets and variables →
  Actions → **Repository secrets**, Environment secrets DEĞİL):

| Secret adı | Değer | Not |
|---|---|---|
| `FTP_SERVER` | `______________________________` | `ftp.meliszararsiz.com` |
| `FTP_USERNAME` | `______________________________` | `ozgasl@meliszararsiz.com` |
| `FTP_PASSWORD` | `______________________________` | |

- **Kontrol:** GitHub repo → **Actions** sekmesi → "Alastyr Canlı Yayın" →
  son çalışmanın yeşil (Success) olup olmadığına bakın.

---

## 7. İçerik Yönetim Sistemi (Sveltia CMS) — teknik detaylar

- **Panel adresi:** `meliszararsiz.com/admin/`
- **Ayar dosyası:** `public/admin/config.yml`
- **Giriş yöntemi:** GitHub OAuth, bir Cloudflare Worker üzerinden
  (Sveltia'nın kendisi bir OAuth sunucusu çalıştırmıyor, bu yüzden küçük bir
  "aracı" script gerekiyor).

**Cloudflare hesabı ve Worker:**
- Cloudflare hesabı: `______________________________` (e-posta)
- Worker adı: `zararsizyasam`
- Worker adresi: `https://zararsizyasam.ozgasl.workers.dev`
- Worker → Settings → **Variables and secrets** (üstteki "runtime" bölümü,
  "Build" bölümü DEĞİL — ikisi birbirinden ayrı ve bu projede bu ayrımı
  atlamak yüzünden giriş sorunları yaşandı):

| Değişken adı | Tip | Değer |
|---|---|---|
| `GITHUB_CLIENT_ID` | Secret | `______________________________` |
| `GITHUB_CLIENT_SECRET` | Secret | `______________________________` |
| `ALLOWED_DOMAINS` | Variable | `meliszararsiz.com,*.meliszararsiz.com` |

**GitHub OAuth App:**
- Adres: `github.com/settings/developers` (Özgür'ün GitHub hesabında)
- Uygulama adı: `______________________________`
- Client ID: `______________________________` *(yukarıdakiyle aynı)*
- Client Secret: `______________________________` *(yukarıdakiyle aynı,
  GitHub bunu sadece bir kere gösterir — kaybolursa "Generate a new client
  secret" ile yenisi alınır ve Cloudflare'daki değer de güncellenir)*
- Callback URL: `https://zararsizyasam.ozgasl.workers.dev/callback`

**Melis'in girişi:**
- GitHub kullanıcı adı: `blossomel`
- Bu hesap, `zararsiz_yasam` deposuna **Collaborator (Write)** olarak
  eklenmiş durumda.

### Öğrenilenler / bilinen tuzaklar (ileride biri bu projeye dokunursa)

1. **Sveltia CMS "editorial workflow" desteklemiyor** — `config.yml`'de bu
   ayar denenip kaldırıldı (bkz. §2). İleride Sveltia bunu eklerse tekrar
   açılabilir.
2. **Cloudflare "Variables and secrets" iki farklı yerde var:** sayfanın
   üstünde "used at runtime" yazan asıl bölüm, bir de aşağıda "Build"
   başlığı altında ayrı bir bölüm. Worker'ın çalışması için değerlerin
   **üstteki (runtime)** bölümde olması gerekiyor.
3. **GitHub'a bağlı otomatik Worker build'leri, dashboard'dan girilen
   runtime değişkenlerini SİLEBİLİR** — bu Cloudflare'ın bilinen bir
   davranışı. Bu yüzden bu Worker'da GitHub'dan otomatik deploy'u kapalı
   tutmak (ya da deploy komutuna `--keep-vars` eklemek) daha güvenli.
4. **`ALLOWED_DOMAINS` yazım kuralı:** wildcard için nokta şart —
   `*.meliszararsiz.com` doğru, `*meliszararsiz.com` (noktasız) çalışmıyor.
   Hem ana domaini hem alt-domainleri kapsamak için ikisini birden yazmak
   gerekiyor: `meliszararsiz.com,*.meliszararsiz.com`.
5. **Alastyr'da FTP hesabının "jail root"una dikkat:** cPanel'de yeni bir
   FTP hesabı oluştururken "Dizin" alanına tam olarak `public_html` yazmak
   gerekiyor — boş bırakılırsa ya da yanlış yazılırsa hesap, gerçek web
   kökünden tamamen farklı, ilgisiz bir klasöre bağlanabiliyor (bu projede
   tam olarak bu yaşandı ve ilk deploy'lar hiç görünmedi).
6. **`server-dir` ayarı workflow dosyasında `./`** — çünkü FTP hesabının
   kendisi zaten `public_html`'in içine bağlı; `./public_html/` yazılırsa
   bir klasör daha içeri, yanlış yere yükleme yapılır.

---

## 8. Bekleyen işler (devam eden görevler)

| # | Görev | Durum |
|---|---|---|
| 1 | GitHub deposunu Melis'in hesabına devretmek | Bu görüşmede konuşuldu, henüz yapılmadı — bkz. bu mesajın üstü |
| 2 | `migration/redirects.htaccess` içeriğini canlı `public_html/.htaccess`'e eklemek (eski `/yazi-adi/` linklerinin yeni `/blog/yazi-adi/`'ye 301 yönlenmesi için) | Bekliyor |
| 3 | ~221 eksik blog görselini Wayback Machine'den kurtarmak (`migration/image-manifest.csv` — hepsini değil, önemli olanları seçmek) | Bekliyor |
| 4 | Eski, kişisel kilo verme/diyet yazıları hakkında editöryel karar (öne çıkar / arşivle) | Melis'in kararı |

---

## 9. Faydalı bağlantılar

- Astro dokümantasyonu: https://docs.astro.build
- Sveltia CMS dokümantasyonu: https://sveltiacms.app/en/docs
- Sveltia CMS Auth (Cloudflare Worker): https://github.com/sveltia/sveltia-cms-auth
- Cloudflare Workers dokümantasyonu: https://developers.cloudflare.com/workers
- GitHub Actions dokümantasyonu: https://docs.github.com/actions

---

## 10. Kimlik bilgileri / erişimler — özet tablo

*(Tüm alanlar bilerek boş — Özgür elle dolduracak)*

| Servis | Kullanıcı adı / e-posta | Şifre / Token | Not |
|---|---|---|---|
| GitHub (Melis'in hesabı) | `blossomel` | *(hesabın kendi şifresi, burada saklanmaz)* | |
| Alastyr cPanel | `______________` | `______________` | |
| Alastyr FTP | `ozgasl@meliszararsiz.com` | `______________` | |
| Cloudflare | `______________` | `______________` | |
| GitHub OAuth App (Client ID) | — | `______________` | |
| GitHub OAuth App (Client Secret) | — | `______________` | |
| Domain kayıt firması (registrar) | `______________` | `______________` | *(bu projede geçmedi, varsa eklenmeli)* |
