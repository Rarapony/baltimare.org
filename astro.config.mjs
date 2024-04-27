import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import icon from "astro-icon";

// import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true
  },
  integrations: [tailwind(), vue(), icon()],
  // output: "hybrid",
  // adapter: cloudflare()
});