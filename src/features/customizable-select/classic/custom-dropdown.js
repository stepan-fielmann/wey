function setupSelect(field) {
  const label = field.querySelector('label');
  const select = field.querySelector('select');
  const combo = field.querySelector('[role="combobox"]');
  const list = field.querySelector('[role="listbox"]');
  const options = [...list.querySelectorAll('[role="option"]')];

  let active = select.selectedIndex;
  const isDisabled = (i) => select.options[i].disabled;

  // Show the selected person in the closed control
  function render() {
    options.forEach((o, i) => o.setAttribute('aria-selected', String(i === select.selectedIndex)));
    combo.replaceChildren(...options[select.selectedIndex].cloneNode(true).childNodes);
  }

  function open() {
    list.hidden = false;
    combo.setAttribute('aria-expanded', 'true');
    setActive(select.selectedIndex);
  }

  function close() {
    list.hidden = true;
    combo.setAttribute('aria-expanded', 'false');
    combo.removeAttribute('aria-activedescendant');
  }

  // The highlighted option (keyboard focus stays on the combobox)
  function setActive(i) {
    options[active].classList.remove('active');
    active = i;
    options[i].classList.add('active');
    combo.setAttribute('aria-activedescendant', options[i].id);
    const o = options[i];
    if (o.offsetTop < list.scrollTop) list.scrollTop = o.offsetTop;
    if (o.offsetTop + o.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = o.offsetTop + o.offsetHeight - list.clientHeight;
    }
  }

  // Write the choice back to the real select and tell the page
  function choose(i) {
    if (isDisabled(i)) return;
    select.selectedIndex = i;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    render();
    close();
  }

  // Next option in a direction, skipping disabled ones
  function step(from, direction) {
    for (let i = from + direction; i >= 0 && i < options.length; i += direction) {
      if (!isDisabled(i)) return i;
    }
    return from;
  }

  // Mouse
  combo.addEventListener('click', () => (list.hidden ? open() : close()));
  list.addEventListener('pointerdown', (e) => e.preventDefault());
  list.addEventListener('click', (e) => {
    const option = e.target.closest('[role="option"]');
    if (option) choose(options.indexOf(option));
  });
  combo.addEventListener('blur', close);
  label.addEventListener('click', (e) => {
    e.preventDefault();
    combo.focus();
  });

  // Keyboard
  combo.addEventListener('keydown', (e) => {
    if (list.hidden) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === 'ArrowDown') setActive(step(active, 1));
    else if (e.key === 'ArrowUp') setActive(step(active, -1));
    else if (e.key === 'Home') setActive(step(-1, 1));
    else if (e.key === 'End') setActive(step(options.length, -1));
    else if (e.key === 'Enter' || e.key === ' ') choose(active);
    else if (e.key === 'Escape') close();
    else if (e.key.length === 1) {
      // Type a letter to jump to the next name that starts with it
      const letter = e.key.toLowerCase();
      for (let k = 1; k <= options.length; k++) {
        const i = (active + k) % options.length;
        if (!isDisabled(i) && select.options[i].text.toLowerCase().startsWith(letter)) {
          setActive(i);
          break;
        }
      }
    } else return;
    e.preventDefault();
  });

  // Form reset changes the real select; update the fake one afterwards
  select.form.addEventListener('reset', () => setTimeout(render));
}

document.querySelectorAll('.field-control').forEach(setupSelect);
