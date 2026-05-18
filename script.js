const items = Array.from(document.querySelectorAll('.xmb-item'));
const cards = Array.from(document.querySelectorAll('.project-card'));
let selectedIndex = -1;

const yearProjects = {
  junior: [
    'Look Ma I Made It',
    'Underground Rap Hangman',
    'Artist Gallery'
  ],
  senior: [
    'NJIT Movie Gallery',
    'Rutgers recruitment site'
  ]
};

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

function renderProjectImages(projects) {
  Object.entries(yearProjects).forEach(([year, nameList]) => {
    const card = document.querySelector(`.project-card[data-year="${year}"]`);
    const container = card?.querySelector('.project-images');
    if (!container) return;

    container.innerHTML = nameList.map(name => {
      const project = projects.find(item => item.name === name);
      if (!project) return '';

      return `
        <a class="project-image-card" href="${project.link}" target="_blank" rel="noopener noreferrer">
          <img src="${project.img}" alt="${project.name}">
          <span>${project.name}</span>
        </a>
      `;
    }).join('');
  });
}

function renderCountdown() {
  const container = document.querySelector('.project-card[data-year="sophomore"] .project-countdown');
  if (!container) return;

  const targetDate = new Date('2026-12-01T00:00:00Z');
  container.innerHTML = `
    <p class="countdown-label">Grand Theft Auto VI Release Countdown</p>
    <div class="countdown-clock">
      <div class="countdown-block"><span class="countdown-value" data-unit="days">0</span><small>Days</small></div>
      <div class="countdown-block"><span class="countdown-value" data-unit="hours">0</span><small>Hours</small></div>
      <div class="countdown-block"><span class="countdown-value" data-unit="minutes">0</span><small>Minutes</small></div>
      <div class="countdown-block"><span class="countdown-value" data-unit="seconds">0</span><small>Seconds</small></div>
    </div>
  `;

  const updateCountdown = () => {
    const now = new Date();
    const diff = targetDate - now;
    const values = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (diff > 0) {
      values.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      values.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      values.minutes = Math.floor((diff / (1000 * 60)) % 60);
      values.seconds = Math.floor((diff / 1000) % 60);
    }

    container.querySelectorAll('.countdown-value').forEach(span => {
      const unit = span.dataset.unit;
      span.textContent = values[unit].toString().padStart(2, '0');
    });
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

async function loadProjectsData() {
  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error('Failed to load projects.json');
    const projects = await response.json();
    renderProjectImages(projects);
  } catch (error) {
    console.error('Unable to render project images:', error);
  }
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

loadProjectsData();
renderCountdown();
clearSelection();
