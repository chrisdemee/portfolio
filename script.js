const items = Array.from(document.querySelectorAll('.xmb-item'));
const cards = Array.from(document.querySelectorAll('.project-card'));
const hero = document.querySelector('.xmb-hero');
const copy = document.querySelector('.xmb-copy');
let selectedIndex = 0;

const yearText = {
  sophomore: {
    title: 'Sophomore Year Projects',
    description: 'Explore creative work from sophomore year in design, motion, and brand systems.'
  },
  junior: {
    title: 'Junior Year Projects',
    description: 'Discover junior year projects focused on web experience, editorial, and UX storytelling.'
  },
  senior: {
    title: 'Senior Year Projects',
    description: 'View senior year concept work with advanced UI, 3D visuals, and responsive product showcases.'
  }
};

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

  hero.textContent = yearText[selectedYear].title;
  copy.textContent = yearText[selectedYear].description;
}

items.forEach((item, index) => {
  item.addEventListener('click', () => updateSelection(index));
});

window.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    updateSelection(selectedIndex + 1);
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    updateSelection(selectedIndex - 1);
  }
  if (event.key === 'Enter') {
    const selectedYear = items[selectedIndex].dataset.year;
    const card = cards.find(card => card.dataset.year === selectedYear);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

updateSelection(selectedIndex);
