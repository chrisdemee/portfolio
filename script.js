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

function createSparkles() {
  const container = document.getElementById('sparkle-background');
  if (!container) return;

  const sparkleCount = 40;
  for (let i = 0; i < sparkleCount; i += 1) {
    const sparkle = document.createElement('div');
    const size = Math.floor(Math.random() * 8) + 4;
    const drift = Math.floor(Math.random() * 120) - 60;
    const duration = Math.random() * 12 + 14;
    const delay = Math.random() * -24;
    const startLeft = Math.random() * 100;
    const scale = (Math.random() * 0.7) + 0.35;

    sparkle.className = 'sparkle';
    sparkle.style.setProperty('--sparkle-size', `${size}px`);
    sparkle.style.setProperty('--sparkle-left', `${startLeft}%`);
    sparkle.style.setProperty('--sparkle-drift-x', `${drift}px`);
    sparkle.style.setProperty('--sparkle-duration', `${duration}s`);
    sparkle.style.setProperty('--sparkle-twinkle', `${Math.random() * 2 + 1.6}s`);
    sparkle.style.setProperty('--sparkle-scale', `${scale}`);
    sparkle.style.setProperty('animation-delay', `${delay}s`);

    container.appendChild(sparkle);
  }
}

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
    <p class="countdown-label">Sophomore projects to be released to public when GTA 6 releases</p>
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

createSparkles();
loadProjectsData();
renderCountdown();
clearSelection();

function updateDateTime() {
  const el = document.getElementById('status-datetime');
  if (!el) return;
  const now = new Date();

  // Format like "8/31 10:02 PM" similar to the PS3 UI
  const datePart = now.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
  const timePart = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  el.textContent = `${datePart} ${timePart}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Fade-in for about page content on load
document.addEventListener('DOMContentLoaded', () => {
  const about = document.querySelector('.about-container');
  if (!about) return;

  // Use requestAnimationFrame to ensure styles have been applied
  requestAnimationFrame(() => {
    // small timeout to make the transition noticeable on very fast loads
    setTimeout(() => {
      about.classList.add('fade-in');

      // also fade in skills panel if present
      const skills = document.querySelector('.skills-panel');
      if (skills) setTimeout(() => skills.classList.add('fade-in'), 140);
    }, 60);
  });
});
