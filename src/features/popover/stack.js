// The top layer is a stack, and showing a popover that is already open does nothing at all.
// Closing it first and showing it again is what moves it to the top.
function raise(popup) {
  popup.hidePopover();
  popup.showPopover();
}

// popover="manual" closes for nobody, so all three stay open together. One listener for the
// lot: a button names the popover it raises, a click anywhere else raises the one it landed on.
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-raise]');
  const popup = button ? document.getElementById(button.dataset.raise) : event.target.closest('[popover]');
  if (popup) raise(popup);
});
