const items = Array.from(document.querySelectorAll('.xmb-item'));
const cards = Array.from(document.querySelectorAll('.project-card'));
let selectedIndex = -1;

function clearSelection() {
  selectedIndex = -1;
  items.forEach(item => {
    item.classList.remove('selected');
    item.setAttribute('aria-selected', 'false');
  });
  cards.forEach(card => card.classList.remove('active'));
}

function updateSelection(index) {
  if (index < 0) index = items.length - 1;
  if (index >= items.length) index = 0;
  selectedIndex = index;

  items.forEach((item, idx) => {
    const active = idx === selectedIndex;
    item.classList.toggle('selected', active);
    item.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  const selectedYear = items[selectedIndex].dataset.year;
  cards.forEach(card => card.classList.toggle('active', card.dataset.year === selectedYear));
}

items.forEach((item, index) => {
  item.addEventListener('click', () => updateSelection(index));
});

window.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (selectedIndex === -1) {
      updateSelection(0);
    } else {
      updateSelection(selectedIndex + 1);
    }
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    if (selectedIndex === -1) {
      updateSelection(items.length - 1);
    } else {
      updateSelection(selectedIndex - 1);
    }
  }
  if (event.key === 'Enter' && selectedIndex !== -1) {
    const selectedYear = items[selectedIndex].dataset.year;
    const card = cards.find(card => card.dataset.year === selectedYear);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

clearSelection();
