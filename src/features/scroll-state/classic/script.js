const scroller = document.querySelector('.report');
const header = document.querySelector('.report-header');

// An invisible 1px sentinel right before the header
const sentinel = document.createElement('div');
sentinel.className = 'sentinel';
header.before(sentinel);

const observer = new IntersectionObserver(
  ([entry]) => {
    // Gone above the top edge: the header is stuck.
    // Gone below the bottom edge: not reached yet.
    const box = entry.boundingClientRect;
    const above = box.bottom <= entry.rootBounds.top;
    const stuck = !entry.isIntersecting && above;
    header.classList.toggle('is-stuck', stuck);
  },
  { root: scroller, threshold: 0 }
);

observer.observe(sentinel);
