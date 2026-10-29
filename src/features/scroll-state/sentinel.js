/*
  Demo helper for the before page, not part of the comparison:
  a toggle (or the S key) that paints the invisible sentinel red.
*/
(function () {
  var stage = document.querySelector('.stage');
  var button = document.createElement('button');
  button.className = 'sentinel-toggle';
  button.textContent = 'Show sentinel';
  button.setAttribute('aria-pressed', 'false');
  stage.append(button);

  function toggle() {
    var on = stage.classList.toggle('show-sentinel');
    button.setAttribute('aria-pressed', String(on));
  }
  button.addEventListener('click', toggle);
  document.addEventListener('keydown', function (e) {
    if ((e.key === 's' || e.key === 'S') && !e.metaKey && !e.ctrlKey && !e.altKey) toggle();
  });
})();
