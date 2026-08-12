Bu not `public/assets/img/` içindeki görselleri anlatır. Kendisi bilerek
`public/` dışında durur — orada olsaydı canlı sitede herkese açık olurdu.

LOGO — İKİ DOSYA VAR, İKİSİ DE GEREKLİ
  logo.png           başlıkta (krem zemin)
  logo-altbilgi.png  alt bilgide (bordo zemin)

Kaynak: Google Drive > görseller > logo.jpeg (Melis'in logosu).

Neden iki dosya: logo.jpeg'in beyaz zemini dışarıdan taşma-doldurma ile
silinmişti. Algoritma harflerin DIŞINDAKİ beyaza ulaştı ama kapalı harf
içlerine giremedi; oralar opak beyaz kaldı (8.864 piksel). Krem zeminde
görünmüyordu, bordo alt bilgide beyaz leke olarak ortaya çıktı.

Düzeltme (Ağustos 2026):
  logo.png          → beyaza yakın pikseller yumuşak eşikle şeffaflaştırıldı
                      (luminans 224-246 arası kademeli). Krem zeminde
                      görünüm eskisiyle birebir aynı.
  logo-altbilgi.png → aynısı + yazı bölgesindeki (alt %30) koyu çizgilerin
                      HSL açıklığı ters çevrildi; ton ve doygunluk korundu.
                      Daireye ve ağaca dokunulmadı. `yaşam` pembesi zaten
                      bordoda okunaklı olduğu için değiştirilmedi.

Ölçüm — ZARARSIZ yazısının bordo zeminde kontrastı:
  harf içi beyaz (eski)      5,18:1  ama gözle çirkin
  harf içi şeffaf            2,74:1  eşik altı, kullanılmadı
  + çizgiler açık (şimdiki)  5,31:1  ✓

Logo değişirse: Melis'ten şeffaf zeminli düzgün bir PNG ya da SVG istemek
kalıcı çözüm olur; o zaman bu türetme adımları gereksizleşir.

Bir dönem alt bilgi için `logo-light.png` kullanıldı; o HER ŞEYİ açıyordu,
daire ve ağaç dalları solduğu için vazgeçildi. Dosya bu klasörde duruyor,
sitede kullanılmıyor.

ANA SAYFA PORTRESİ
anasayfa-melis.jpg / .webp      : 420x623  (1x)
anasayfa-melis@2x.jpg / .webp   : 840x1247 (2x)

Kaynak dosya `assets-kaynak/anasayfa.png` (1024x1537). O dosyanın kendi
krem paspartusu ve kemer kırpması var; buradaki türevler paspartu
kırpıldıktan sonra (x 19..1003, y 27..1488) üretildi. Sitedeki kemer
şeklini global.css'teki `.hero-photo` border-radius'u veriyor, fotoğrafın
kendi kemeri değil.

Fotoğraf değişirse: paspartusuz, dikey bir kareyi doğrudan panelden
("Site Metinleri > Anasayfa > Üstteki fotoğraf") yüklemek yeterli.
src/site.js dosyanın piksel boyutunu ve varsa @2x/.webp varyantlarını
kendiliğinden bulur; varyant yoksa tek dosyayla da çalışır.

assets-kaynak/ klasörü yayına girmez, sadece yüksek çözünürlüklü
kaynakları saklar (buyukada-melis.jpg eski portredir, artık kullanılmıyor).
