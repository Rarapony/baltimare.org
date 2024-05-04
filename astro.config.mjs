import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import icon from "astro-icon";

// import cloudflare from "@astrojs/cloudflare";

import playformCompress from "@playform/compress";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://baltimare.org",
  prefetch: {
    prefetchAll: true
  },
  integrations: [tailwind(), vue(), icon(), playformCompress(), sitemap()]
  // output: "hybrid",
  // adapter: cloudflare()
});