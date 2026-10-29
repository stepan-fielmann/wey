// Clones, installs and builds a pinned, self-hosted LiveCodes app into .tooling/livecodes.
// Follows https://livecodes.io/docs/features/self-hosting/ ("Build from Source").
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { LIVECODES_DIR, LIVECODES_REPO, LIVECODES_TAG } from './livecodes.config.mjs';

const run = (cmd, args, opts = {}) => {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { stdio: 'inherit', ...opts });
};
const git = (...args) => run('git', args, { cwd: LIVECODES_DIR });
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

if (!existsSync(join(LIVECODES_DIR, '.git'))) {
  mkdirSync(dirname(LIVECODES_DIR), { recursive: true });
  run('git', ['clone', '--depth', '1', '--branch', LIVECODES_TAG, LIVECODES_REPO, LIVECODES_DIR]);
} else {
  let current = '';
  try {
    current = execFileSync('git', ['describe', '--tags', '--exact-match'], {
      cwd: LIVECODES_DIR,
      encoding: 'utf8',
    }).trim();
  } catch {
    // Not exactly on a tag; check out the pinned one below.
  }
  if (current !== LIVECODES_TAG) {
    git('fetch', '--depth', '1', 'origin', 'tag', LIVECODES_TAG);
    git('checkout', '--force', LIVECODES_TAG);
  }
}

// --ignore-scripts skips the upstream postinstall, which also installs the docs site,
// storybook and docker server. None of them are needed for the static app.
// Its only other step (patch-package) is run explicitly afterwards.
run(npm, ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: LIVECODES_DIR });
run(join(LIVECODES_DIR, 'node_modules/.bin/patch-package'), [], { cwd: LIVECODES_DIR });

// DOCS_BASE_URL=null builds only the app and points documentation links to livecodes.io/docs.
run(npm, ['run', 'build:app'], {
  cwd: LIVECODES_DIR,
  env: { ...process.env, DOCS_BASE_URL: 'null' },
});

console.log(`\nLiveCodes ${LIVECODES_TAG} built in ${join(LIVECODES_DIR, 'build')}`);
console.log('Start it with: npm run livecodes   (or everything with: npm run dev)');
