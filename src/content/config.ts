import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
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

const meetups = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    icon: z.string().optional().default("kitap"),
    // Bu buluşmaya ait blog yazılarının kategorisi. Aynı kategoride en az bir
    // yazı varsa kutunun altında "yazılar" linki çıkar.
    category: z.string().optional(),
    order: z.number().optional().default(0),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog, events, meetups };
