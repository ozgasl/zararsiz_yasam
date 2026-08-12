LOGO: Bu klasördeki `logo.png` hem başlıkta hem alt bilgide kullanılır.
Kaynak: Google Drive > görseller > logo.jpeg (Melis'in logosu).
`logo.png`, o dosyanın arka planı şeffaflaştırılmış halidir. Logo
değişirse ikisini birlikte güncellemek gerekir.

Bir dönem alt bilgi için açıltılmış `logo-light.png` kullanıldı; bordo
zeminde ağaç dalları ve gradyan solduğu için vazgeçildi (Ağustos 2026).
Dosya assets-kaynak/ altında duruyor, sitede kullanılmıyor.

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
