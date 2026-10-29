import { getPlaygroundUrl } from 'livecodes';
import { LIVECODES_URL } from './livecodes-url.js';
import { listPages, URL_PARAMS } from './views.js';

// Every feature directory contains a feature.js with a list of views (Classic, Future and the
// Future's Solution). A view opens at ?view=<slug>: a slim header and the local LiveCodes app
// (its `livecodes` URL) below it.
const modules = import.meta.glob('../features/*/feature.js', { eager: true, import: 'default' });

export const features = Object.entries(modules)
  .map(([path, feature]) => ({ ...feature, dir: path.split('/')[2] }))
  .sort((a, b) => a.order - b.order);

export const pages = listPages(features).map((page) => ({
  ...page,
  href: `?view=${page.slug}`,
  livecodes: getPlaygroundUrl({
    appUrl: LIVECODES_URL,
    config: new URL(`${import.meta.env.BASE_URL}configs/${page.slug}.json`, location.origin).href,
    params: URL_PARAMS,
  }),
}));

export const pagesOf = (feature) => pages.filter((p) => p.feature === feature);

// Everything but the solutions, which are reached from their Future only.
export const walked = pages.filter((p) => p.view.mode !== 'solution');

// The arrows move between features, always landing on the first page of one.
const entries = features.map((feature) => walked.find((p) => p.feature === feature));
export const featureStep = (feature, delta) => entries[features.indexOf(feature) + delta];
export const solutionOf = (feature) => pages.find((p) => p.feature === feature && p.view.mode === 'solution');

// How a feature's pages are listed, in the header and on the dashboard: the walked ones,
// with the solution tucked in behind the Future it belongs to.
export function linkedPagesOf(feature) {
  const solution = solutionOf(feature);
  const out = [];
  for (const page of pagesOf(feature)) {
    if (page.view.mode === 'solution') continue;
    out.push(page);
    if (solution && page.view.mode === 'future' && !out.includes(solution)) out.push(solution);
  }
  return out;
}
