import './shared/page.css';
import { pages } from './shared/routes.js';

// "/" is the start screen, "/?list" the presenter's list of every view, and
// "/?view=<slug>" a view (header + LiveCodes).
const params = new URLSearchParams(location.search);
const index = pages.findIndex((p) => p.slug === params.get('view'));

if (index !== -1) {
  document.querySelector('#dashboard').remove();
  const { renderView } = await import('./shared/view-page.js');
  await renderView(index);
} else {
  document.querySelector('#view').remove();
  const { renderDashboard, renderStart } = await import('./shared/dashboard.js');
  if (params.has('list')) renderDashboard();
  else renderStart();
}
