// Vite plugin: serves one LiveCodes config per view at /configs/<feature id>/<mode>[-<step>].json.
// In dev the JSON is built from the files on disk at every request, so reloading the LiveCodes tab
// picks up edits. `vite build` writes the same files into dist/configs/.
import { globSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildConfig, listPages } from '../src/shared/views.js';
import { imagesUrlOf } from './site-url.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// Images in the previews are loaded from this app (public/images). For a build they come from
// SITE_URL; IMAGES_URL overrides that for an unusual setup.
const BUILD_IMAGES_URL = process.env.IMAGES_URL ?? imagesUrlOf(process.env.SITE_URL);

async function loadPages() {
  const files = globSync('src/features/*/feature.js', { cwd: ROOT });
  const features = await Promise.all(
    files.map(async (file) => {
      // Cache-busting query: feature.js may have changed since the last request.
      const url = `${pathToFileURL(join(ROOT, file)).href}?t=${Date.now()}`;
      const { default: feature } = await import(url);
      return { ...feature, dir: basename(dirname(file)) };
    }),
  );
  return listPages(features);
}

function configFor(page, imagesUrl) {
  const readFile = (name) =>
    readFileSync(
      name.startsWith('/') ? join(ROOT, 'src', name) : join(ROOT, 'src/features', page.feature.dir, name),
      'utf8',
    );
  return JSON.stringify(buildConfig(page, readFile, { imagesUrl }), null, 2);
}

export function livecodesConfigs() {
  return {
    name: 'livecodes-configs',

    configureServer(server) {
      server.middlewares.use('/configs/', async (req, res, next) => {
        const slug = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '').replace(/\.json$/, '');
        const page = (await loadPages()).find((p) => p.slug === slug);
        if (!page) return next();
        try {
          const json = configFor(page, `http://${req.headers.host}/images`);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'no-store');
          res.end(json);
        } catch (error) {
          next(error);
        }
      });
    },

    async generateBundle() {
      for (const page of await loadPages()) {
        this.emitFile({
          type: 'asset',
          fileName: `configs/${page.slug}.json`,
          source: configFor(page, BUILD_IMAGES_URL),
        });
      }
    },
  };
}
