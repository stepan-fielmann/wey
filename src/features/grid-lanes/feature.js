// Based on Lunch and Learn Simple / 08-grid-lanes. Same scene in every view.
const scene = { markup: 'markup.html', style: 'look.css', script: 'more.js' };

export default {
  id: 'grid-lanes',
  order: 5,
  title: 'CSS Grid Lanes',
  caniuse: 'css-grid-lanes',
  support: {
    css: 'display: grid-lanes',
    hint: 'Use Safari 26.4+, or Chrome with “Experimental Web Platform features” on.',
  },
  views: [
    {
      mode: 'classic',
      label: 'JavaScript measures and positions every card',
      note:
        'Lanes from the width, every tile at the bottom of the shortest lane, the height set by hand, and ' +
        'observers for resized and newly loaded tiles. Try "Load more" and resizing the preview.',
      activeEditor: 'script',
      hidden: scene,
      visible: { style: 'classic/style.css', script: 'classic/script.js' },
    },
    {
      mode: 'solution',
      note:
        'Two display lines: lanes where they work, and a regular grid where the browser skips that ' +
        'second line. The exercise page leaves the fallback out, so there the tiles just stack.',
      activeEditor: 'style',
      hidden: scene,
      visible: { style: 'solution.css' },
    },
    {
      mode: 'future',
      note:
        'Without a display of its own the gallery just stacks the tiles. Task: lay them out with ' +
        'display: grid-lanes – the line is in the editor, commented out.',
      activeEditor: 'style',
      hidden: scene,
      visible: { style: 'future.css' },
    },
  ],
};
