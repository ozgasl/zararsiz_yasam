LOGO: Bu klasördeki `logo.png` başlık ve alt bilgide kullanılır.
Kaynak: Google Drive > görseller > logo.jpeg (Melis'in logosu).
`logo.png`, o dosyanın arka planı şeffaflaştırılmış halidir (koyu mod ve
alt bilgi zemininde doğru görünmesi için). Logo değişirse ikisini birlikte
güncellemek gerekir.
`logo-light.png` alt bilgideki bordo zemin için açık varyanttır.

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
