import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.meliszararsiz.com",
  trailingSlash: "always",
  build: { format: "directory" },
});
