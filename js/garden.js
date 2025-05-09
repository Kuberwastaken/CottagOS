// Garden Planner Game (Enhanced Cottagecore Redesign)
const ROWS = 4;
const COLS = 5;
const PLANTS = [
  { name: 'Tulip', key: 'tulip', stages: ['seed', 'sprout', 'tulip_mature', 'tulip_harvest'], info: 'Tulip: Grows in 3 days, needs sunlight.', icon: '��' },
  { name: 'Tomato', key: 'tomato', stages: ['seed', 'sprout', 'tomato_mature', 'tomato_harvest'], info: 'Tomato: Grows in 4 days, needs daily watering.', icon: '🍅' },
  { name: 'Lavender', key: 'lavender', stages: ['seed', 'sprout', 'lavender_mature', 'lavender_harvest'], info: 'Lavender: Grows in 5 days, prefers sunny days.', icon: '💜' },
  { name: 'Mushroom', key: 'mushroom', stages: ['seed', 'sprout', 'mushroom_mature', 'mushroom_harvest'], info: 'Mushroom: Grows in 2 days, likes rain.', icon: '🍄' }
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
    if (day % 2 === 0) {
      const weatherTypes = ['sun', 'rain', 'cloud'];
      weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    }
    updateGardenGrowth();
    renderGardenUI(container);
  }, 60000); // 1 minute = 1 day
  renderGardenUI(container);
}

function renderGardenUI(container) {
  container.innerHTML = '';

  const appLayout = document.createElement('div');
  appLayout.className = 'garden-app-layout';

  // Add placeholder divs for CSS corner flowers
  const cornerFlowerTL = document.createElement('div');
  cornerFlowerTL.className = 'corner-flower-tl';
  appLayout.appendChild(cornerFlowerTL);

  const cornerFlowerTR = document.createElement('div');
  cornerFlowerTR.className = 'corner-flower-tr';
  appLayout.appendChild(cornerFlowerTR);
  // You can add BR and BL if you make CSS rules for them too.

  const mainTitle = document.createElement('h2');
  mainTitle.className = 'garden-main-title';
  mainTitle.textContent = 'My Little Cottage Garden'; 
  appLayout.appendChild(mainTitle);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'garden-content-wrapper';

  const infoPanel = document.createElement('div');
  infoPanel.className = 'garden-info-panel';
  infoPanel.innerHTML = `
    <h3 class="info-panel-title">Gardener's Log</h3>
    <div class="info-item"><strong>Day:</strong> <span id="garden-day">${day}</span></div>
    <div class="info-item"><strong>Weather:</strong> <span id="garden-weather-icon">${window.GARDEN_SVGS[weather] || weather}</span> <span id="garden-weather-text">${weather.charAt(0).toUpperCase() + weather.slice(1)}</span></div>
    <div class="info-item"><strong>Water:</strong> <span id="garden-water">${resources.water}</span>💧</div>
    <div class="info-item"><strong>Coins:</strong> <span id="garden-coins">${resources.coins}</span>💰</div>
    <div class="info-item"><strong>Seeds:</strong> <span id="garden-seeds">${resources.seeds}</span><span class="seed-icon">🌰</span></div>
  `;
  contentWrapper.appendChild(infoPanel);

  const mainContent = document.createElement('div');
  mainContent.className = 'garden-main-content';

  const actionsToolbar = document.createElement('div');
  actionsToolbar.className = 'garden-actions-toolbar';
  ['plant', 'water', 'harvest', 'remove'].forEach(tool => {
    const btn = document.createElement('button');
    btn.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
    btn.className = 'garden-action-btn' + (selectedTool === tool ? ' selected' : '');
    btn.onclick = () => { selectedTool = tool; renderGardenUI(container); };
    actionsToolbar.appendChild(btn);
  });
  mainContent.appendChild(actionsToolbar);

  const grid = document.createElement('div');
  grid.className = 'garden-plot-grid';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'garden-plot-cell';
      const plot = garden[r][c];
      if (plot) {
        let stageKey = PLANTS[plot.type].stages[plot.stage];
        cell.innerHTML = window.GARDEN_SVGS[stageKey] || PLANTS[plot.type].icon || '🌱';
        if (plot.wilted) cell.classList.add('wilted');
        if (plot.watered) cell.classList.add('watered');
        cell.title = PLANTS[plot.type].name + ' - ' + (plot.wilted ? 'Wilted!' : stageKey);
      } else {
        cell.innerHTML = window.GARDEN_SVGS.dirt || '~';
      }
      cell.onclick = () => handleCellClick(r, c, container);
      grid.appendChild(cell);
    }
  }
  mainContent.appendChild(grid);

  if (selectedTool === 'plant') {
    const plantSelectionToolbar = document.createElement('div');
    plantSelectionToolbar.className = 'garden-plant-selection-toolbar';
    PLANTS.forEach((plant, idx) => {
      const plantItem = document.createElement('div');
      plantItem.className = 'garden-plant-item' + (selectedPlant === idx ? ' selected' : '');
      plantItem.title = plant.info;
      plantItem.onclick = () => { selectedPlant = idx; renderGardenUI(container); };
      
      const plantIcon = document.createElement('div');
      plantIcon.className = 'plant-icon-display';
      plantIcon.innerHTML = window.GARDEN_SVGS[plant.key + '_mature'] || plant.icon || plant.name.charAt(0);

      const plantName = document.createElement('div');
      plantName.className = 'plant-name-display';
      plantName.textContent = plant.name;

      plantItem.appendChild(plantIcon);
      plantItem.appendChild(plantName);
      plantSelectionToolbar.appendChild(plantItem);
    });
    mainContent.appendChild(plantSelectionToolbar);
  }
  
  contentWrapper.appendChild(mainContent);
  appLayout.appendChild(contentWrapper);
  container.appendChild(appLayout);
}

function handleCellClick(r, c, container) {
  const plot = garden[r][c];
  if (selectedTool === 'plant' && !plot && resources.seeds > 0) {
    garden[r][c] = { type: selectedPlant, stage: 0, watered: false, wilted: false, days: 0 };
    resources.seeds--;
  } else if (selectedTool === 'water' && plot && !plot.wilted && !plot.watered && resources.water > 0) {
    plot.watered = true;
    resources.water--;
  } else if (selectedTool === 'harvest' && plot && plot.stage === PLANTS[plot.type].stages.length - 1 && !plot.wilted) {
    resources.coins += PLANTS[plot.type].name === 'Mushroom' ? 3 : 2;
    resources.seeds += PLANTS[plot.type].name === 'Lavender' ? 2 : 1;
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
      if (plot) { // Ensure plot exists before trying to access its properties
        let plantData = PLANTS[plot.type]; // Define here to be available for the whole block
        if (!plot.wilted) {
          plot.days++;

          // Weather effects
          if (weather === 'rain') {
            plot.watered = true;
          } else if (weather === 'sun' && plantData.name === 'Tulip') {
            if (plot.stage < plantData.stages.length - 2) plot.days++;
          }

          let canGrow = plot.watered || plantData.name === 'Mushroom';

          if (canGrow && plot.stage < plantData.stages.length - 2) {
            let daysToNextStage = 1; // Default, specific logic below overrides
            if(plantData.name === 'Tulip' && plot.days >= 3) plot.stage++;
            else if(plantData.name === 'Tomato' && plot.days >= 4) plot.stage++;
            else if(plantData.name === 'Lavender' && plot.days >= 5) plot.stage++;
            else if(plantData.name === 'Mushroom' && plot.days >= 2) plot.stage++;
            // Note: The generic 'else if (plot.days >= daysToNextStage ...)' might be redundant
            // if all plants have specific growth days.

            if (plot.stage >= plantData.stages.length -2) {
              plot.stage = plantData.stages.length -2; 
            }
            plot.watered = false; 
          } else if (!plot.watered && plantData.name !== 'Mushroom') {
            if (plot.days > (plantData.name === 'Tomato' ? 1 : 2) && plot.stage < plantData.stages.length -2) {
              plot.wilted = true;
            }
          }
          if(plot.stage === plantData.stages.length -2 ) {
              plot.stage = plantData.stages.length -1; 
          }
        } else { // Plot is wilted
          if (plot.watered && plantData.name !== 'Mushroom') { // Check plantData here too
            plot.wilted = false;
            plot.days = 0; 
          }
        }
      }
    }
  }
}

// Expose init function for window manager
window.initGardenPlanner = initGardenPlanner; 