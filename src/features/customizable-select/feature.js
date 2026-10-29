// Based on Lunch and Learn Simple / 03-customizable-select. Same looks in every view.
const scene = { style: 'look.css' };
// The modern views also get the closed control for free: that box is the same one Classic 1
// builds by hand, and showing it again would only bury the new code.
const modernScene = { style: ['look.css', 'control.css'] };

export default {
  id: 'select',
  order: 3,
  title: 'Customizable Select',
  caniuse: 'customizable-select',
  support: { css: 'appearance: base-select' },
  views: [
    {
      mode: 'classic',
      label: 'Style the box, live with the native list',
      note:
        'appearance: none and a background arrow style the closed control; the list that opens is drawn by ' +
        'the browser and the OS – text only, almost no styles. Emoji flags, <optgroup> and <hr> do work in it.',
      activeEditor: 'style',
      hidden: scene,
      visible: { markup: 'classic/styled-select.html', style: 'classic/styled-select.css' },
    },
    {
      mode: 'classic',
      label: 'Hide the real select, build a fake one',
      note:
        'A hidden real <select> keeps the form value; a combobox + listbox mirror it: open/close, selection, ' +
        'keyboard (arrows, Home/End, Enter/Space, Escape, type-ahead), disabled options, label click, form reset.',
      activeEditor: 'script',
      hidden: scene,
      visible: {
        markup: 'classic/custom-dropdown.html',
        style: 'classic/custom-dropdown.css',
        script: 'classic/custom-dropdown.js',
      },
    },
    {
      mode: 'solution',
      note: 'A real <select>, styled: rich options, the chosen one copied into the closed control.',
      activeEditor: 'style',
      hidden: modernScene,
      visible: { markup: 'solution.html', style: 'solution.css' },
    },
    {
      mode: 'future',
      note:
        'Task: (1) CSS: opt the select and its picker in with appearance: base-select. (2) HTML: add ' +
        '<button><selectedcontent></selectedcontent></button> as the first child of the select. ' +
        'Both are in the editors, commented out.',
      activeEditor: 'style',
      hidden: modernScene,
      visible: { markup: 'future.html', style: 'future.css' },
    },
  ],
};
