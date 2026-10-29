/*
  Demo helper, the same on both pages and not part of the comparison:
  drag the button (or move it with the arrow keys) anywhere in the scrollable
  area. It moves the button only, and fires a "move" event on it.
*/
(function () {
  var content = document.querySelector('.content');
  var button = document.querySelector('.button');
  var grab = null;

  function moveTo(left, top) {
    var maxX = content.clientWidth - button.offsetWidth;
    var maxY = content.clientHeight - button.offsetHeight;
    button.style.left = Math.round(Math.max(0, Math.min(maxX, left))) + 'px';
    button.style.top = Math.round(Math.max(0, Math.min(maxY, top))) + 'px';
    button.dispatchEvent(new Event('move'));
  }

  button.addEventListener('pointerdown', function (e) {
    var r = button.getBoundingClientRect();
    grab = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    button.setPointerCapture(e.pointerId);
  });
  button.addEventListener('pointermove', function (e) {
    if (!grab) return;
    // The content's rectangle already includes the scroll offset.
    var c = content.getBoundingClientRect();
    moveTo(e.clientX - c.left - grab.dx, e.clientY - c.top - grab.dy);
  });
  button.addEventListener('pointerup', function () {
    grab = null;
  });
  button.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 60 : 15;
    var d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d) return;
    e.preventDefault();
    moveTo(button.offsetLeft + d[0], button.offsetTop + d[1]);
  });

  // The start position is set in look.css: in LiveCodes the preview can still be 0×0 when
  // this runs, and placing the button from here would put it in the corner.
})();
