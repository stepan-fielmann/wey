// Observation helpers for the experiment: log state changes and the order popovers were shown in.
// `beforetoggle` is used because `toggle` events are coalesced (hide + show in one task fires nothing).
{
  const log = document.querySelector('#log');
  const openList = document.querySelector('#open-list');
  const openOrder = [];

  for (const popover of document.querySelectorAll('[popover]')) {
    popover.addEventListener('beforetoggle', (event) => {
      const index = openOrder.indexOf(popover.id);
      if (index !== -1) openOrder.splice(index, 1);
      if (event.newState === 'open') openOrder.push(popover.id);
      log.textContent = `${popover.id}: ${event.oldState} → ${event.newState}\n` + log.textContent;
      openList.textContent = openOrder.join(' → ') || 'none';
    });
  }

  for (const button of document.querySelectorAll('[data-show-both]')) {
    const popovers = button.dataset.showBoth.split(' ').map((id) => document.getElementById(id));
    button.addEventListener('click', () => {
      for (const popover of popovers) {
        if (!popover.matches(':popover-open')) popover.showPopover();
      }
    });
  }

  for (const button of document.querySelectorAll('[data-reshow]')) {
    const popover = document.getElementById(button.dataset.reshow);
    button.addEventListener('click', () => {
      if (popover.matches(':popover-open')) popover.hidePopover();
      popover.showPopover();
    });
  }
}
