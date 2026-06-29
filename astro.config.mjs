import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.ASTRO_SITE ?? "https://www.meliszararsiz.com",
  base: process.env.ASTRO_BASE_PATH ?? "/",
  trailingSlash: "always",
  build: { format: "directory" },
});
