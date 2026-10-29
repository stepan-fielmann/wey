// Based on Lunch and Learn Simple / 02-popover. The page is deliberately bare – a stage and the
// looks of the buttons and popups – so that nothing competes with the popover itself.
const scene = { markup: 'markup.html', style: 'scene.css' };

export default {
  id: 'popover',
  order: 2,
  title: 'Popover API',
  caniuse: 'mdn-html_global_attributes_popover',
  support: { api: 'popover' },
  views: [
    {
      mode: 'classic',
      label: 'JavaScript shows the popup and handles closing',
      note:
        'What popover="auto" does, by hand: toggle, aria-expanded, a backdrop element, Escape and click ' +
        'outside to close, and focus back to the button.',
      activeEditor: 'script',
      hidden: scene,
      visible: { markup: 'classic/markup.html', style: 'classic/style.css', script: 'classic/script.js' },
    },
    {
      mode: 'solution',
      note: 'An attribute and a ::backdrop rule. Escape, click outside and focus return come with the API.',
      activeEditor: 'markup',
      hidden: scene,
      visible: { markup: 'solution.html', style: 'popup.css' },
    },
    {
      mode: 'future',
      note:
        'The popup is a plain element sitting in the page. Task: add popovertarget to "Share", popover to ' +
        'the popup, and popovertarget + popovertargetaction="hide" to "Close" – the finished tags are in ' +
        'the editor, commented out.',
      activeEditor: 'markup',
      hidden: scene,
      visible: { markup: 'future.html', style: 'popup.css' },
    },
    {
      mode: 'bonus',
      label: 'Three popovers in the top layer',
      note:
        'popover="manual" keeps all three open at once, overlapping at the corners. Click one, or a button ' +
        'that names it, to bring it to the front: a popover shown again moves to the top of the top layer.',
      activeEditor: 'script',
      hidden: scene,
      visible: { markup: 'stack.html', style: 'stack.css', script: 'stack.js' },
    },
  ],
};
