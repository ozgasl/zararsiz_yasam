import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    // CMS'teki "date" alanı otomatik dolduruluyor. Panelde bir aksaklık
    // olursa (ör. boş kayıt) build'in tamamen çökmemesi için boş/geçersiz
    // değerde build anına düşüyoruz — sıralama bozulmaz, site yayından
    // düşmez.
    date: z.preprocess((v) => {
      if (v === "" || v === null || v === undefined) return new Date();
      return v;
    }, z.coerce.date()),
    categories: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    legacyUrl: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// "Duyurular" — yalnızca anasayfa ve Kitap sayfasındaki kayan bandı besler.
// Kendi sayfası yoktur; etkinliğin ayrıntıları blog yazısı olarak yazılır.
const events = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    link: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// "Birlikte Çalışalım" altındaki 3 hizmet sayfası (mindfulness koçluğu,
// yin yoga, meditasyon). Dosya adı = URL: /birlikte-calisalim/<dosya-adi>/
const hizmetler = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    // Sayfanın başlığının altındaki kısa tanıtım metni. Aynı metin
    // Birlikte Çalışalım ana sayfasındaki kutuda da kullanılır.
    lead: z.string(),
    // "Kimler için" etiketleri, ayrı ayrı satırlar halinde girilir.
    tags: z.array(z.string()).optional().default([]),
    order: z.number().optional().default(0),
    draft: z.boolean().optional().default(false),
    // Gövde (body): tanıtımın altında görünen, seansların/derslerin nasıl
    // işlediğini anlatan asıl metin.
  }),
});

const meetups = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    icon: z.string().optional().default("kitap"),
    // Bu buluşmaya ait blog yazılarının kategorisi. Aynı kategoride en az bir
    // yazı varsa kutunun altında "yazılar" linki çıkar.
    category: z.string().optional(),
    order: z.number().optional().default(0),
    // Melis panelden açıp kapatır: açıkken anasayfa kutusunda ve bu
    // buluşmanın kendi sayfasında "Aktif" etiketi görünür.
    active: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog, events, meetups, hizmetler };
