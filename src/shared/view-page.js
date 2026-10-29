import { LIVECODES_URL } from './livecodes-url.js';
import { featureStep, features, linkedPagesOf, pages } from './routes.js';

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};
const link = (href, text, className) => Object.assign(el('a', className, text), { href });

/**
 * A view: a slim header (like Lunch and Learn Simple) and the LiveCodes app below it.
 * Keys [ and ] go to the previous / next view while the focus is in the header page.
 */
export async function renderView(index) {
  const page = pages[index];
  const { feature } = page;
  const prev = featureStep(feature, -1);
  const next = featureStep(feature, 1);
  document.title = `${feature.title} – ${page.label}`;

  const header = el('header', 'top');
  const nav = el('nav', 'pages');
  for (const p of linkedPagesOf(feature)) {
    const solution = p.view.mode === 'solution';
    const a = link(p.href, solution ? '(s)' : p.prefix, solution ? 'solution' : p.view.mode);
    a.title = solution ? 'Solution: the same page with nothing commented out' : p.view.label ?? p.view.note ?? '';
    if (solution) a.setAttribute('aria-label', 'Solution');
    if (p === page) a.setAttribute('aria-current', 'page');
    nav.append(a);
  }
  const side = el('nav', 'side');
  const count = el('span', 'count', `${feature.order} / ${features.length}`);
  count.title = feature.title;
  count.setAttribute('aria-label', `Feature ${feature.order} of ${features.length}`);
  if (feature.caniuse) {
    const caniuse = link(`https://caniuse.com/${feature.caniuse}`, 'Can I use ↗', 'caniuse');
    Object.assign(caniuse, { target: '_blank', rel: 'noopener' });
    side.append(caniuse);
  }
  const arrows = el('span', 'arrows');
  for (const [target, symbol, name] of [[prev, '←', 'Previous'], [next, '→', 'Next']]) {
    const a = target ? link(target.href, symbol) : el('span', '', symbol);
    a.title = target ? `${name} feature: ${target.feature.title}` : `${name} feature: none`;
    a.setAttribute('aria-label', target ? `${name} feature: ${target.feature.title}` : `No ${name.toLowerCase()} feature`);
    arrows.append(a);
  }
  side.append(count, arrows);
  header.append(nav, side);

  const main = document.querySelector('#view');
  main.replaceChildren(header);

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === ']' && next) location.href = next.href;
    if (event.key === '[' && prev) location.href = prev.href;
  });

  const reachable = await fetch(LIVECODES_URL, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' }).then(
    () => true,
    () => false,
  );
  if (!reachable) {
    main.append(el('p', 'view-error', `LiveCodes is not reachable at ${LIVECODES_URL} – run "npm run livecodes".`));
    return;
  }
  const frame = el('iframe', 'livecodes');
  frame.title = `${feature.title} – ${page.label}`;
  frame.allow = 'clipboard-read; clipboard-write';
  frame.src = page.livecodes;
  main.append(frame);
}
