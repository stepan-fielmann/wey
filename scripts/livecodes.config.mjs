import { fileURLToPath } from 'node:url';

export const LIVECODES_REPO = 'https://github.com/live-codes/livecodes.git';
// App release tag. Keep it compatible with the `livecodes` SDK version in package.json.
export const LIVECODES_TAG = 'v49';
export const LIVECODES_DIR = fileURLToPath(new URL('../.tooling/livecodes', import.meta.url));

// The LiveCodes app hard-codes its local sandbox to http://127.0.0.1:8085
// whenever the app itself is served from localhost / 127.0.0.1.
export const APP_HOST = 'localhost';
export const APP_PORT = 8080;
export const SANDBOX_HOST = '127.0.0.1';
export const SANDBOX_PORT = 8085;
