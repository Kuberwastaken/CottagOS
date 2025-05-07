// Garden Planner Game (Enhanced)
const ROWS = 4;
const COLS = 5;
const PLANTS = [
  { name: 'Tulip', key: 'tulip', stages: ['seed', 'sprout', 'tulip_mature', 'tulip_harvest'], info: 'Tulip: Grows in 3 days, needs sunlight.' },
  { name: 'Tomato', key: 'tomato', stages: ['seed', 'sprout', 'tomato_mature', 'tomato_harvest'], info: 'Tomato: Grows in 4 days, needs daily watering.' },
  { name: 'Lavender', key: 'lavender', stages: ['seed', 'sprout', 'lavender_mature', 'lavender_harvest'], info: 'Lavender: Grows in 5 days, prefers sunny days.' },
  { name: 'Mushroom', key: 'mushroom', stages: ['seed', 'sprout', 'mushroom_mature', 'mushroom_harvest'], info: 'Mushroom: Grows in 2 days, likes rain.' }
];

let garden = [];
let selectedPlant = 0;
let selectedTool = 'plant';
let resources = { water: 10, coins: 0, seeds: 2 };
let weather = 'sun';
let day = 1;
let clockInterval = null;

function initGardenPlanner(container) {
  // Initialize garden state
  garden = Array.from({length: ROWS}, () => Array.from({length: COLS}, () => null));
  selectedPlant = 0;
  selectedTool = 'plant';
  resources = { water: 10, coins: 0, seeds: 2 };
  weather = 'sun';
  day = 1;
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(() => {
    day++;
    // Change weather every 2 days
    if (day % 2 === 0) {
      const w = ['sun', 'rain', 'cloud'];
      weather = w[Math.floor(Math.random() * w.length)];
    }
    updateGardenGrowth();
    renderGardenUI(container);
  }, 60000); // 1 min = 1 day
  renderGardenUI(container);
}

function renderGardenUI(container) {
  container.innerHTML = '';
  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'garden-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-section"><strong>Day:</strong> ${day}</div>
    <div class="sidebar-section"><strong>Weather:</strong> <span class="weather-icon">${window.GARDEN_SVGS[weather]}</span></div>
    <div class="sidebar-section"><strong>Water:</strong> ${resources.water}</div>
    <div class="sidebar-section"><strong>Coins:</strong> ${resources.coins}</div>
    <div class="sidebar-section"><strong>Seeds:</strong> ${resources.seeds}</div>
  `;
  container.appendChild(sidebar);
  // Main area
  const mainArea = document.createElement('div');
  mainArea.className = 'garden-mainarea';
  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'garden-toolbar';
  ['plant','water','harvest','remove'].forEach(tool => {
    const btn = document.createElement('button');
    btn.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
    btn.className = 'garden-tool' + (selectedTool === tool ? ' selected' : '');
    btn.onclick = () => { selectedTool = tool; renderGardenUI(container); };
    toolbar.appendChild(btn);
  });
  mainArea.appendChild(toolbar);
  // Plant selection
  if (selectedTool === 'plant') {
    const plantPanel = document.createElement('div');
    plantPanel.className = 'plant-panel';
    PLANTS.forEach((plant, idx) => {
      const btn = document.createElement('button');
      btn.innerHTML = window.GARDEN_SVGS[plant.stages[2]] + ' ' + plant.name;
      btn.className = 'plant-btn' + (selectedPlant === idx ? ' selected' : '');
      btn.title = plant.info;
      btn.onclick = () => { selectedPlant = idx; renderGardenUI(container); };
      plantPanel.appendChild(btn);
    });
    mainArea.appendChild(plantPanel);
  }
  // Garden grid
  const grid = document.createElement('div');
  grid.className = 'garden-grid';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'garden-cell';
      const plot = garden[r][c];
      if (plot) {
        let stageKey = PLANTS[plot.type].stages[plot.stage];
        cell.innerHTML = window.GARDEN_SVGS[stageKey];
        if (plot.wilted) cell.classList.add('wilted');
        if (plot.watered) cell.classList.add('watered');
        cell.title = PLANTS[plot.type].info + (plot.wilted ? ' (Wilted!)' : '');
      } else {
        cell.innerHTML = window.GARDEN_SVGS.dirt;
      }
      cell.onclick = () => handleCellClick(r, c, container);
      grid.appendChild(cell);
    }
  }
  mainArea.appendChild(grid);
  container.appendChild(mainArea);
  // Weather overlay
  const overlay = document.createElement('div');
  overlay.className = 'garden-weather-overlay';
  overlay.innerHTML = window.GARDEN_SVGS[weather];
  mainArea.appendChild(overlay);
}

function handleCellClick(r, c, container) {
  const plot = garden[r][c];
  if (selectedTool === 'plant' && !plot && resources.seeds > 0) {
    garden[r][c] = { type: selectedPlant, stage: 0, watered: false, wilted: false, days: 0 };
    resources.seeds--;
  } else if (selectedTool === 'water' && plot && !plot.wilted && !plot.watered && resources.water > 0) {
    plot.watered = true;
    resources.water--;
  } else if (selectedTool === 'harvest' && plot && plot.stage === 3 && !plot.wilted) {
    resources.coins += 2;
    resources.seeds++;
    garden[r][c] = null;
  } else if (selectedTool === 'remove' && plot) {
    garden[r][c] = null;
  }
  renderGardenUI(container);
}

function updateGardenGrowth() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const plot = garden[r][c];
      if (plot) {
        // Growth logic
        if (!plot.wilted) {
          plot.days++;
          // Weather effects
          if (weather === 'rain') plot.watered = true;
          if (weather === 'sun' && plot.stage < 3) plot.days++;
          // Growth
          if (plot.watered && plot.stage < 3) {
            plot.stage++;
            plot.watered = false;
          } else if (!plot.watered && plot.stage < 3) {
            // If not watered, may wilt
            if (plot.days > 2) plot.wilted = true;
          }
        } else {
          // Wilted plants can be revived by watering
          if (plot.watered) plot.wilted = false;
        }
      }
    }
  }
}

// Expose init function for window manager
window.initGardenPlanner = initGardenPlanner; 