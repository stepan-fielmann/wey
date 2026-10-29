// Serves the self-hosted LiveCodes build and its result sandbox, like the upstream
// `npm run serve`, but without opening a browser window.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  APP_HOST,
  APP_PORT,
  LIVECODES_DIR,
  SANDBOX_HOST,
  SANDBOX_PORT,
} from './livecodes.config.mjs';

if (!existsSync(join(LIVECODES_DIR, 'build/index.html'))) {
  console.error('LiveCodes is not built yet. Run: npm run setup:livecodes');
  process.exit(1);
}

const liveServer = join(LIVECODES_DIR, 'node_modules/.bin/live-server');
const common = ['--cors', '--quiet', '--no-browser'];

const servers = [
  spawn(liveServer, ['build', `--host=${APP_HOST}`, `--port=${APP_PORT}`, '--watch=build/tmp/', ...common], {
    cwd: LIVECODES_DIR,
    stdio: 'inherit',
  }),
  spawn(liveServer, ['src/livecodes/html/sandbox/', `--host=${SANDBOX_HOST}`, `--port=${SANDBOX_PORT}`, ...common], {
    cwd: LIVECODES_DIR,
    stdio: 'inherit',
  }),
];

console.log(`LiveCodes app:     http://${APP_HOST}:${APP_PORT}/`);
console.log(`LiveCodes sandbox: http://${SANDBOX_HOST}:${SANDBOX_PORT}/`);

const stop = () => servers.forEach((s) => s.kill());
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
for (const s of servers) s.on('exit', (code) => { stop(); process.exitCode = code ?? 0; });
