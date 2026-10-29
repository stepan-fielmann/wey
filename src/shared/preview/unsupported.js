// A small note in the preview when the browser lacks the feature a modern view shows.
// `support` comes from feature.js: { css: 'display: grid-lanes' } or { api: 'popover' }.
function showUnsupported(support) {
  const API = { popover: () => 'showPopover' in HTMLElement.prototype };
  const ok = support.api ? API[support.api]() : CSS.supports(support.css);
  if (ok) return;
  const note = document.createElement('p');
  note.className = 'unsupported';
  const name = document.createElement('b');
  name.textContent = support.feature;
  const text = document.createElement('span');
  text.append(name, ' isn’t supported in this browser.' + (support.hint ? ` ${support.hint}` : ''));
  note.append(text);
  (document.querySelector('.stage') ?? document.body).prepend(note);
}
