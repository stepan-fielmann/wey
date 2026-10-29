// The self-hosted LiveCodes app: `npm run livecodes` in dev, a copy shipped next to the built
// site (dist/livecodes/) otherwise. Override with VITE_LIVECODES_URL (e.g. in .env.local).
// BASE_URL is Vite's `base`, so this keeps working in a subdirectory (GitHub Pages).
export const LIVECODES_URL =
  import.meta.env.VITE_LIVECODES_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:8080/'
    : new URL(`${import.meta.env.BASE_URL}livecodes/`, location.origin).href);
