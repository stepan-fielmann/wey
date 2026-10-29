const gallery = document.querySelector('.gallery');
const MIN_WIDTH = 200;
const GAP = 16;

function layout() {
  // How many lanes fit, and how wide each one is
  const width = gallery.clientWidth;
  const fit = Math.floor((width + GAP) / (MIN_WIDTH + GAP));
  const count = Math.max(1, fit);
  const laneWidth = (width - GAP * (count - 1)) / count;
  const laneHeights = new Array(count).fill(0);
  const tiles = [...gallery.children];

  tiles.forEach((tile) => (tile.style.width = laneWidth + 'px'));

  // Put every tile at the bottom of the shortest lane
  tiles.forEach((tile) => {
    const lane = laneHeights.indexOf(Math.min(...laneHeights));
    const x = lane * (laneWidth + GAP);
    const y = laneHeights[lane];
    tile.style.transform = `translate(${x}px, ${y}px)`;
    laneHeights[lane] += tile.getBoundingClientRect().height + GAP;
  });

  // Absolute tiles take no space, so set the height by hand
  gallery.style.height = Math.max(...laneHeights) - GAP + 'px';
}

// Lay out once, in the next frame. Inside the observer it
// would resize what it watches: "ResizeObserver loop" error.
let queued = false;
function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    layout();
  });
}

// The gallery and every tile can change size (images, fonts)...
const resize = new ResizeObserver(schedule);
resize.observe(gallery);
[...gallery.children].forEach((tile) => resize.observe(tile));

// ...and new tiles can arrive
new MutationObserver((records) => {
  for (const record of records) {
    record.addedNodes.forEach((tile) => resize.observe(tile));
  }
  schedule();
}).observe(gallery, { childList: true });

layout();
