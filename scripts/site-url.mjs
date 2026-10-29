// Where the built site will be served from, as one setting: SITE_URL.
// It gives Vite its `base` (so assets resolve in a subdirectory) and the previews their image URLs
// (which must be absolute, because the code runs in LiveCodes' sandbox on another origin).
// Unset means the site sits at the root of its host, as in `npm run preview`.

/** The pathname of SITE_URL, always with a trailing slash: "/wey/" or "/". */
export function basePathOf(siteUrl) {
  if (!siteUrl) return '/';
  return new URL(siteUrl).pathname.replace(/\/?$/, '/');
}

/** Where public/images will be reachable once deployed. */
export function imagesUrlOf(siteUrl) {
  if (!siteUrl) return 'http://localhost:4173/images';
  return new URL('images', siteUrl.replace(/\/?$/, '/')).href;
}
