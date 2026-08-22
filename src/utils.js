/**
 * Yazı gövdesindeki (Markdown ya da zengin metinden gelen HTML) ilk görselin
 * yolunu bulur. "Kapak Görseli" alanı panelde yok; Melis fotoğrafı doğrudan
 * yazının içine ekliyor, bu yüzden anasayfa kartlarında kapak boşsa buna
 * düşüyoruz. `cover` alanı elle doldurulmuşsa her zaman ona öncelik verilir.
 */
export function firstImage(body) {
  if (!body) return null;
  const md = body.match(/!\[[^\]]*\]\(([^)\s]+)/);
  if (md) return md[1];
  const html = body.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (html) return html[1];
  return null;
}

export function slugify(str) {
  const map = { "ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g", "ü": "u", "Ü": "u", "ö": "o", "Ö": "o", "ç": "c", "Ç": "c" };
  return str
    .replace(/[ıİşŞğĞüÜöÖçÇ]/g, (c) => map[c] || c)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
