import { features, linkedPagesOf, walked } from './routes.js';
import { LIVECODES_URL } from './livecodes-url.js';

// Classic views get the warm colour, modern ones the accent (as in the view header badges).
const LINK_CLASS = { classic: 'classic', future: 'modern', solution: 'solution', bonus: 'modern' };

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};
const link = (href, text, className) => Object.assign(el('a', className, text), { href });

/** The page the audience sees: a title and one button, nothing else. */
export function renderStart() {
  document.querySelector('#intro').remove();
  document.querySelector('.note').remove();
  document.querySelector('#start').replaceChildren(link(walked[0].href, 'Start', 'start'));
}

/** The presenter's list of every view, at /?list */
export function renderDashboard() {
  document.querySelector('#features').hidden = false;
  const rows = features.map((feature) => {
    const links = el('span', 'links');
    for (const page of linkedPagesOf(feature)) {
      const solution = page.view.mode === 'solution';
      const a = link(page.href, solution ? '(s)' : page.prefix, LINK_CLASS[page.view.mode]);
      a.title = solution ? 'Solution: the same page with nothing commented out' : page.view.label ?? page.view.note ?? '';
      if (solution) a.setAttribute('aria-label', 'Solution');
      links.append(a);
    }
    if (feature.caniuse) {
      const caniuse = link(`https://caniuse.com/${feature.caniuse}`, 'Can I use ↗', 'caniuse');
      Object.assign(caniuse, { target: '_blank', rel: 'noopener' });
      links.append(caniuse);
    }
    const li = el('li');
    li.append(el('span', 'n', String(feature.order).padStart(2, '0')), el('span', 'name', feature.title), links);
    return li;
  });
  document.querySelector('#features').replaceChildren(...rows);
  showLiveCodesStatus();
}

function showLiveCodesStatus() {
  const status = document.querySelector('#livecodes-status');
  status.textContent = `checking ${LIVECODES_URL} …`;
  fetch(LIVECODES_URL, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' }).then(
    () => (status.textContent = `running at ${LIVECODES_URL}`),
    () => (status.textContent = `NOT reachable at ${LIVECODES_URL} – run "npm run livecodes"`),
  );
}
