// Based on Lunch and Learn Simple / 04-sticky-header. Same scene in every view.
const scene = { markup: 'markup.html', style: 'look.css' };

export default {
  id: 'scroll-state',
  order: 4,
  title: 'Scroll-state Container Queries',
  caniuse: 'mdn-css_at-rules_container_scroll-state_queries',
  support: { css: 'container-type: scroll-state' },
  views: [
    {
      mode: 'classic',
      label: 'A hidden sentinel and an observer guess when it is stuck',
      note:
        'A 1px sentinel right before the sticky header and an IntersectionObserver on the scrolling report. ' +
        'Press "Show sentinel" (or S) to see it.',
      activeEditor: 'script',
      hidden: { ...scene, script: 'sentinel.js' },
      visible: { style: 'classic/style.css', script: 'classic/script.js' },
    },
    {
      mode: 'solution',
      note: 'CSS asks the header if it is stuck. No observer, no JavaScript.',
      activeEditor: 'style',
      hidden: scene,
      visible: { style: 'solution.css' },
    },
    {
      mode: 'future',
      note:
        'The container query is already written, but it has no container to ask: nothing happens. ' +
        'Task: uncomment container-type: scroll-state.',
      activeEditor: 'style',
      hidden: scene,
      visible: { style: 'future.css' },
    },
  ],
};
