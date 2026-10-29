// Starts the local LiveCodes servers and the Vite dev server together.
import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [
  spawn(npm, ['run', 'livecodes'], { stdio: 'inherit' }),
  spawn(npm, ['run', 'dev:app'], { stdio: 'inherit' }),
];

const stop = () => children.forEach((c) => c.kill());
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
for (const c of children) c.on('exit', (code) => { stop(); process.exitCode = code ?? 0; });
