// Copies the self-hosted LiveCodes build next to the built site, so the deployed app serves its
// own playground from <site>/livecodes/ instead of a machine on localhost.
// The app's own files are referenced relatively, so a subdirectory is fine. Its result sandbox is
// not part of this copy: LiveCodes loads that from livecodes-sandbox.pages.dev off localhost.
import { cp, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { LIVECODES_DIR, LIVECODES_TAG } from './livecodes.config.mjs';

const source = join(LIVECODES_DIR, 'build');
const target = fileURLToPath(new URL('../dist/livecodes', import.meta.url));

if (!existsSync(join(source, 'index.html'))) {
  console.error(`LiveCodes ${LIVECODES_TAG} is not built in ${source}. Run: npm run setup:livecodes`);
  process.exit(1);
}

await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
console.log(`LiveCodes ${LIVECODES_TAG} copied into dist/livecodes/ (${(await readdir(target)).length} entries)`);
