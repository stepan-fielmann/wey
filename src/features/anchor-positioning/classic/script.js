const button = document.querySelector('.button');
const tooltip = document.querySelector('.tooltip');
const scroller = document.querySelector('.scroller');
const GAP = 12;
const SIDES = ['top', 'bottom', 'right', 'left'];
let lastSide = 'top';
let frame = 0;

function placeTooltip() {
  frame = 0;
  const a = button.getBoundingClientRect();
  const w = tooltip.offsetWidth;
  const h = tooltip.offsetHeight;
  // The area the tooltip may use: what is on screen
  const area = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };

  // Centred on the button, but kept inside the area
  const x = clamp(a.left + a.width / 2 - w / 2, area.left + GAP, area.right - GAP - w);
  const y = clamp(a.top + a.height / 2 - h / 2, area.top + GAP, area.bottom - GAP - h);
  const spots = {
    top: { x, y: a.top - GAP - h },
    bottom: { x, y: a.bottom + GAP },
    right: { x: a.right + GAP, y },
    left: { x: a.left - GAP - w, y },
  };
  // Is there enough room on that side of the button?
  const room = {
    top: a.top - area.top - h,
    bottom: area.bottom - a.bottom - h,
    right: area.right - a.right - w,
    left: a.left - area.left - w,
  };
  const fits = (side) => room[side] >= 2 * GAP;

  // Keep the last side while it fits, so the tooltip doesn't jump back and forth
  lastSide = fits(lastSide) ? lastSide : SIDES.find(fits) || lastSide;

  // Screen coordinates → coordinates inside the tooltip's positioned parent
  const parent = tooltip.offsetParent;
  const origin = parent.getBoundingClientRect();
  tooltip.style.left = spots[lastSide].x - origin.left - parent.clientLeft + 'px';
  tooltip.style.top = spots[lastSide].y - origin.top - parent.clientTop + 'px';
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Scroll and resize events come in bursts: place at most once per frame
function schedule() {
  if (!frame) frame = requestAnimationFrame(placeTooltip);
}

// Every way the button can move relative to the screen needs its own listener
scroller.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule);
button.addEventListener('move', schedule);

// Hide the tooltip while its button is scrolled out of sight
new IntersectionObserver(([entry]) => {
  tooltip.style.visibility = entry.isIntersecting ? '' : 'hidden';
}).observe(button);

placeTooltip();
