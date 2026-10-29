// Based on Lunch and Learn Simple / 01-anchor-positioning. Same scene in every view;
// its markup is visible in the editor, the looks and dragging are hidden.
const scene = { style: 'look.css', script: 'drag.js' };
const markup = 'markup.html';

export default {
  id: 'anchor',
  order: 1,
  title: 'CSS Anchor Positioning',
  caniuse: 'css-anchor-positioning',
  support: { css: 'anchor-name: --a' },
  views: [
    {
      mode: 'classic',
      label: 'JavaScript measures and places the tooltip',
      note:
        'Finds every clipping ancestor, keeps the tooltip inside the visible area, flips it to another side, ' +
        're-places it on scroll, resize, drag and size changes, and hides it when the button is out of sight.',
      activeEditor: 'script',
      hidden: { ...scene, style: ['look.css', 'positioned.css'] },
      visible: { markup, script: 'classic/script.js' },
    },
    {
      mode: 'solution',
      note: 'CSS ties the tooltip to the button. Drag it to an edge or scroll it out of sight.',
      activeEditor: 'style',
      hidden: scene,
      visible: { markup, style: 'solution.css' },
    },
    {
      mode: 'future',
      note:
        'Task: tie the tooltip to the button with anchor positioning – the lines are in the editor, ' +
        'commented out.',
      activeEditor: 'style',
      hidden: scene,
      visible: { markup, style: 'future.css' },
    },
  ],
};
