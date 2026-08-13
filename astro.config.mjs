import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Kanonik adres www'suz: meliszararsiz.com (karar Ağustos 2026).
  // www tarafı migration/redirects.htaccess içindeki 301 ile buraya yönlenir.
  site: process.env.ASTRO_SITE ?? "https://meliszararsiz.com",
  base: process.env.ASTRO_BASE_PATH ?? "/",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [
    sitemap({
      // Sitedeki bağlantılar sonu eğik çizgili (trailingSlash: "always");
      // sitemap de aynı biçimi kullanmalı, yoksa Google gereksiz yönlendirme görür.
      changefreq: "weekly",
      filter: (sayfa) => !sayfa.includes("/admin"),
    }),
  ],
});
