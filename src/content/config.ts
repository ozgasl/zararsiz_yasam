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

export const collections = { blog };
