const backdrop = document.querySelector('.backdrop');
// On a page with dozens of popups neither of these is known in advance: both the popup
// and the control it was opened from have to be worked out from the click.
let openPopup = null;
let opener = null;

function open(popup, trigger) {
  if (openPopup) close();
  openPopup = popup;
  opener = trigger;
  popup.hidden = false;
  backdrop.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  // Click outside (on the backdrop) or Escape closes it
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', onKeyDown);
}

function close() {
  if (!openPopup) return;
  openPopup.hidden = true;
  backdrop.hidden = true;
  opener.setAttribute('aria-expanded', 'false');
  backdrop.removeEventListener('click', close);
  document.removeEventListener('keydown', onKeyDown);
  // Give focus back to the control this popup was opened from. Without it focus falls back
  // to <body> and the next Tab starts at the top of the page. A popover does it on its own,
  // for any invoker, because the browser knows which one it was.
  if (openPopup.contains(document.activeElement)) opener.focus();
  openPopup = null;
  opener = null;
}

function onKeyDown(event) {
  if (event.key === 'Escape') close();
}

// One listener for the whole page: the event tells us which control was used and, through
// its aria-controls, which popup it opens. The same code serves any number of them.
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[aria-controls]');
  if (!trigger) {
    // a Close button inside the popup
    if (event.target.closest('.close')) close();
    return;
  }
  const popup = document.getElementById(trigger.getAttribute('aria-controls'));
  // The same control toggles: a second click (or Enter) closes it again
  popup === openPopup ? close() : open(popup, trigger);
});
