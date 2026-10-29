import { defineConfig } from 'vite';
import { livecodesConfigs } from './scripts/vite-livecodes-configs.mjs';
import { basePathOf } from './scripts/site-url.mjs';

export default defineConfig({
  // SITE_URL is where the built site will live, e.g.
  // SITE_URL=https://stepan-fielmann.github.io/wey npm run build
  base: basePathOf(process.env.SITE_URL),
  plugins: [livecodesConfigs()],
  server: {
    port: 5173,
    strictPort: true,
    // The upstream LiveCodes checkout is large and is not part of this app.
    watch: { ignored: ['**/.tooling/**'] },
  },
  preview: { port: 4173, strictPort: true },
  optimizeDeps: { entries: ['index.html'] },
});
