// Garden Planner Game (Enhanced Cottagecore Redesign)
const ROWS = 4;
const COLS = 5;
const PLANTS = [
  { name: 'Tulip', key: 'tulip', stages: ['seed', 'sprout', 'tulip_mature', 'tulip_harvest'], info: 'Tulip: Grows in 3 days, needs sunlight.', icon: '🌷' },
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
let isMobile = false;
let isLogExpanded = false;

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
  
  // Better mobile detection
  isMobile = window.innerWidth <= 768 || 
             document.body.classList.contains('mobile-mode') || 
             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Set log expanded state based on device
  isLogExpanded = !isMobile; // Expanded on desktop, collapsed on mobile
  
  // Add window resize listener to update mobile status
  window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768 || 
               document.body.classList.contains('mobile-mode') ||
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Update log expanded state if device type changed
    if (wasMobile !== isMobile) {
      // Only auto-collapse/expand when the device type changes and the user hasn't manually toggled
      isLogExpanded = !isMobile;
      renderGardenUI(container);
    }
  });
  
  renderGardenUI(container);
}

function renderGardenUI(container) {
  container.innerHTML = '';

  // Add mobile-specific CSS
  const mobileStyles = document.createElement('style');
  mobileStyles.textContent = `
    .garden-app-layout {
      position: relative;
      font-family: 'Quicksand', sans-serif;
      width: 100%;
      height: 100%;
      background-color: #f8f5e6;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><path d="M0,0 L10,10 M20,0 L30,10 M40,0 L50,10 M60,0 L70,10 M80,0 L90,10" stroke="%237d6b5d" stroke-width="1"/></svg>');
    }
    
    /* Mobile-specific styles */
    @media (max-width: 768px), 
    (max-device-width: 768px),
    (pointer: coarse) {
      .garden-app-layout {
        padding: 0;
        overflow-y: auto;
        max-height: 100%;
        min-height: 100%;
        touch-action: pan-y;
      }
      
      .garden-main-title {
        font-size: 2rem !important;
        margin: 8px 0 !important;
      }
      
      .garden-content-wrapper {
        flex-direction: column !important;
      }
      
      .garden-info-panel {
        width: 100% !important;
        margin: 0 auto 8px !important;
        border-radius: 12px !important;
        max-height: ${isLogExpanded ? 'none' : '48px'} !important;
        overflow: hidden;
        transition: all 0.3s ease-in-out;
        max-width: 94% !important;
        position: relative;
        padding: ${isLogExpanded ? '15px' : '10px 15px'} !important;
      }
      
      .collapsed-garden-info {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        height: 30px;
      }
      
      .collapsed-info-item {
        font-family: 'Nanum Pen Script', cursive;
        font-size: 1.3rem;
        color: #7d6b5d;
        display: flex;
        align-items: center;
        white-space: nowrap;
      }
      
      .collapsed-info-item strong {
        color: #8d6e63;
        margin-right: 5px;
      }
      
      .collapsed-title {
        font-family: 'Cormorant Garamond', serif;
        color: #8d6e63;
        font-size: 1.2rem;
        padding: 0 10px;
        white-space: nowrap;
      }
      
      .info-panel-toggle {
        display: flex !important;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.1rem;
        color: #8d6e63;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px 0;
        margin: 0;
        height: 100%;
        min-height: 44px; /* Minimum touch target size */
      }
      
      .info-panel-title {
        display: ${isLogExpanded ? 'block' : 'none'};
      }
      
      .garden-info-panel .info-item {
        margin-bottom: 8px !important;
        font-size: 1.2rem !important;
        display: ${isLogExpanded ? 'flex' : 'none'};
      }
      
      .info-panel-title {
        margin-bottom: 10px !important;
      }
      
      .garden-main-content {
        width: 100% !important;
        padding: 0 !important;
      }
      
      .garden-plot-grid {
        margin: 0 auto !important;
        width: 94% !important;
        max-width: 340px !important;
        gap: 8px !important;
      }
      
      .garden-plot-cell {
        min-height: 60px !important;
        min-width: 60px !important;
        font-size: 1.5em !important; /* Larger plant icons */
        touch-action: manipulation;
      }
      
      .garden-actions-toolbar {
        margin: 10px auto !important;
        width: 94% !important;
        gap: 8px !important;
      }
      
      .garden-action-btn {
        flex: 1 !important;
        padding: 12px 8px !important; /* Larger touch target */
        min-height: 44px !important; /* Minimum touch target size */
        font-size: 1rem !important;
        touch-action: manipulation;
      }
      
      .garden-plant-selection-toolbar {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        margin: 10px auto !important;
        width: 94% !important;
        gap: 8px !important;
      }
      
      .garden-plant-item {
        margin: 4px !important;
        padding: 12px 8px !important; /* Larger touch target */
        min-height: 80px !important; /* Minimum touch target size */
        touch-action: manipulation;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .plant-icon-display {
        font-size: 2rem !important;
        margin-bottom: 8px !important;
      }
      
      .plant-name-display {
        font-size: 1rem !important;
      }
    }
    
    .corner-flower-tl, .corner-flower-tr {
      position: absolute;
      width: 40px;
      height: 40px;
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0.7;
      z-index: 1;
    }
    
    .corner-flower-tl {
      top: 10px;
      left: 10px;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="%239CAF88"><path d="M12,2C8.1,2,5,5.1,5,9c0,2.4,1.2,4.5,3,5.7V17c0,2.2,1.8,4,4,4s4-1.8,4-4v-2.3c1.8-1.3,3-3.4,3-5.7C19,5.1,15.9,2,12,2z M15,9c-0.6,0.6-1.5,1-2.5,1S10.6,9.6,10,9c0.6-0.6,1.5-1,2.5-1S14.4,8.4,15,9z"/></svg>');
      transform: rotate(-45deg);
    }
    
    .corner-flower-tr {
      top: 10px;
      right: 10px;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="%239CAF88"><path d="M12,2C8.1,2,5,5.1,5,9c0,2.4,1.2,4.5,3,5.7V17c0,2.2,1.8,4,4,4s4-1.8,4-4v-2.3c1.8-1.3,3-3.4,3-5.7C19,5.1,15.9,2,12,2z M15,9c-0.6,0.6-1.5,1-2.5,1S10.6,9.6,10,9c0.6-0.6,1.5-1,2.5-1S14.4,8.4,15,9z"/></svg>');
      transform: rotate(45deg);
    }
    
    .garden-main-title {
      font-family: 'Indie Flower', cursive;
      text-align: center;
      color: #8d6e63;
      font-size: 2.4rem;
      margin: 15px 0;
      text-shadow: 1px 1px 0 rgba(255,255,255,0.8);
      position: relative;
      z-index: 2;
    }
    
    .garden-content-wrapper {
      display: flex;
      padding: 0 20px;
      flex: 1;
      gap: 20px;
    }
    
    .garden-info-panel {
      width: 260px;
      background-color: #f8f3e6;
      border-radius: 12px;
      padding: 15px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(209, 196, 173, 0.4);
      position: relative;
      border: 1px solid #d4c1a1;
    }
    
    .info-panel-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: #8d6e63;
      font-size: 1.2rem;
      padding: 5px;
      width: 100%;
      cursor: pointer;
    }
    
    .info-panel-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.6rem;
      color: #8d6e63;
      margin-bottom: 12px;
      text-align: center;
      border-bottom: 1px solid #d4c1a1;
      padding-bottom: 8px;
    }
    
    .info-item {
      font-family: 'Nanum Pen Script', cursive;
      font-size: 1.3rem;
      color: #7d6b5d;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .info-item strong {
      width: 90px;
      display: inline-block;
      color: #8d6e63;
    }
    
    .garden-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .garden-actions-toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      background-color: rgba(254, 250, 238, 0.6);
      padding: 10px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(209, 196, 173, 0.3);
    }
    
    .garden-action-btn {
      flex: 1;
      background-color: #e6dbca;
      border: 1px solid #d4c1a1;
      border-radius: 8px;
      padding: 10px 15px;
      color: #7d6b5d;
      font-family: 'Quicksand', sans-serif;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .garden-action-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><path d="M0,0 L20,20 M40,0 L60,20 M80,0 L100,20" stroke="%237d6b5d" stroke-width="1"/></svg>');
      opacity: 0.2;
    }
    
    .garden-action-btn:hover {
      background-color: #f0e6d2;
      transform: translateY(-2px);
    }
    
    .garden-action-btn.selected {
      background-color: #9caf88;
      color: #fff;
    }
    
    .garden-plot-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 6px;
      margin-bottom: 15px;
      background-color: #a98274;
      padding: 8px;
      border-radius: 12px;
      box-shadow: 0 6px 10px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.1);
      position: relative;
    }
    
    .garden-plot-grid::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" opacity="0.1"><path d="M0,0 L60,60 M60,0 L0,60" stroke="%23fff" stroke-width="1"/></svg>');
      opacity: 0.1;
      border-radius: 12px;
      pointer-events: none;
    }
    
    .garden-plot-cell {
      aspect-ratio: 1;
      background-color: #8d6e63;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }
    
    .garden-plot-cell:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.2);
    }
    
    .garden-plot-cell.watered::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(156, 175, 216, 0.3);
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" opacity="0.5"><circle cx="10" cy="10" r="2" fill="%23a8c6df"/><circle cx="30" cy="30" r="2" fill="%23a8c6df"/><circle cx="20" cy="20" r="1" fill="%23a8c6df"/></svg>');
      pointer-events: none;
    }
    
    .garden-plot-cell.wilted {
      opacity: 0.7;
    }
    
    .garden-plot-cell.wilted::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(169, 99, 75, 0.2);
      pointer-events: none;
    }
    
    .garden-plant-selection-toolbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      background-color: rgba(254, 250, 238, 0.6);
      padding: 15px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(209, 196, 173, 0.3);
    }
    
    .garden-plant-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      background-color: #e6dbca;
      border: 1px solid #d4c1a1;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 90px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .garden-plant-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .garden-plant-item.selected {
      background-color: #9caf88;
      border-color: #7d9163;
    }
    
    .garden-plant-item[title*="Tulip"] {
      background-color: #f8e2e2;
    }
    
    .garden-plant-item[title*="Tomato"] {
      background-color: #f8e6dc;
    }
    
    .garden-plant-item[title*="Lavender"] {
      background-color: #e8e2f0;
    }
    
    .garden-plant-item[title*="Mushroom"] {
      background-color: #e5e8dc;
    }
    
    .plant-icon-display {
      font-size: 1.8rem;
      margin-bottom: 5px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .plant-name-display {
      font-family: 'Quicksand', sans-serif;
      font-size: 0.9rem;
      color: #7d6b5d;
      text-align: center;
    }
    
    .garden-plant-item.selected .plant-name-display {
      color: #fff;
    }
  `;
  
  document.head.appendChild(mobileStyles);

  const appLayout = document.createElement('div');
  appLayout.className = 'garden-app-layout';

  // Add placeholder divs for CSS corner flowers
  const cornerFlowerTL = document.createElement('div');
  cornerFlowerTL.className = 'corner-flower-tl';
  appLayout.appendChild(cornerFlowerTL);

  const cornerFlowerTR = document.createElement('div');
  cornerFlowerTR.className = 'corner-flower-tr';
  appLayout.appendChild(cornerFlowerTR);

  const mainTitle = document.createElement('h2');
  mainTitle.className = 'garden-main-title';
  mainTitle.textContent = 'My Little Cottage Garden'; 
  appLayout.appendChild(mainTitle);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'garden-content-wrapper';

  const infoPanel = document.createElement('div');
  infoPanel.className = 'garden-info-panel';
  
  // Add toggle button for mobile
  const toggleButton = document.createElement('button');
  toggleButton.className = 'info-panel-toggle';
  
  if (isLogExpanded) {
    toggleButton.innerHTML = '<span>▲ Gardener\'s Log ▲</span>';
  } else {
    // Create a completely new layout for collapsed mode with proper spacing
    const collapsedInfo = document.createElement('div');
    collapsedInfo.className = 'collapsed-garden-info';
    
    // Day count on the left
    const dayItem = document.createElement('div');
    dayItem.className = 'collapsed-info-item';
    const dayLabel = document.createElement('strong');
    dayLabel.textContent = 'Day:';
    const dayValue = document.createElement('span');
    dayValue.textContent = ' ' + day;
    dayItem.appendChild(dayLabel);
    dayItem.appendChild(dayValue);
    
    // Gardener's Log text in the middle
    const titleSpan = document.createElement('div');
    titleSpan.className = 'collapsed-title';
    titleSpan.innerHTML = '▼ Gardener\'s Log ▼';
    
    // Seeds count on the right
    const seedItem = document.createElement('div');
    seedItem.className = 'collapsed-info-item';
    const seedLabel = document.createElement('strong');
    seedLabel.textContent = 'Seeds:';
    const seedValue = document.createElement('span');
    seedValue.textContent = ' ' + resources.seeds + ' 🌰';
    seedItem.appendChild(seedLabel);
    seedItem.appendChild(seedValue);
    
    // Add all elements to the collapsed info container
    collapsedInfo.appendChild(dayItem);
    collapsedInfo.appendChild(titleSpan);
    collapsedInfo.appendChild(seedItem);
    
    // Clear the toggle button and append the new layout
    toggleButton.innerHTML = '';
    toggleButton.appendChild(collapsedInfo);
  }
  
  // Add click and touch event listeners
  toggleButton.addEventListener('click', () => {
    isLogExpanded = !isLogExpanded;
    renderGardenUI(container);
  });
  toggleButton.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent double-tap zoom
    isLogExpanded = !isLogExpanded;
    renderGardenUI(container);
  });
  
  infoPanel.appendChild(toggleButton);
  
  const infoPanelTitle = document.createElement('h3');
  infoPanelTitle.className = 'info-panel-title';
  infoPanelTitle.textContent = 'Gardener\'s Log';
  infoPanel.appendChild(infoPanelTitle);
  
  const dayInfo = document.createElement('div');
  dayInfo.className = 'info-item';
  const dayLabel = document.createElement('strong');
  dayLabel.textContent = 'Day:';
  const dayValue = document.createElement('span');
  dayValue.id = 'garden-day';
  dayValue.textContent = day;
  dayInfo.appendChild(dayLabel);
  dayInfo.appendChild(document.createTextNode(' '));
  dayInfo.appendChild(dayValue);
  infoPanel.appendChild(dayInfo);
  
  const weatherInfo = document.createElement('div');
  weatherInfo.className = 'info-item';
  const weatherLabel = document.createElement('strong');
  weatherLabel.textContent = 'Weather:';
  const weatherIcon = document.createElement('span');
  weatherIcon.id = 'garden-weather-icon';
  
  // Use proper emoji icons for weather
  if (weather === 'sun') {
    weatherIcon.textContent = '☀️';
  } else if (weather === 'rain') {
    weatherIcon.textContent = '🌧️';
  } else if (weather === 'cloud') {
    weatherIcon.textContent = '☁️';
  } else {
    weatherIcon.textContent = weather;
  }
  
  const weatherText = document.createElement('span');
  weatherText.id = 'garden-weather-text';
  weatherText.textContent = ' ' + weather.charAt(0).toUpperCase() + weather.slice(1);
  
  weatherInfo.appendChild(weatherLabel);
  weatherInfo.appendChild(document.createTextNode(' '));
  weatherInfo.appendChild(weatherIcon);
  weatherInfo.appendChild(weatherText);
  infoPanel.appendChild(weatherInfo);
  
  const waterInfo = document.createElement('div');
  waterInfo.className = 'info-item';
  const waterLabel = document.createElement('strong');
  waterLabel.textContent = 'Water:';
  const waterValue = document.createElement('span');
  waterValue.id = 'garden-water';
  waterValue.textContent = resources.water;
  const waterIcon = document.createElement('span');
  waterIcon.textContent = ' 💧';
  
  waterInfo.appendChild(waterLabel);
  waterInfo.appendChild(document.createTextNode(' '));
  waterInfo.appendChild(waterValue);
  waterInfo.appendChild(waterIcon);
  infoPanel.appendChild(waterInfo);
  
  const coinsInfo = document.createElement('div');
  coinsInfo.className = 'info-item';
  const coinsLabel = document.createElement('strong');
  coinsLabel.textContent = 'Coins:';
  const coinsValue = document.createElement('span');
  coinsValue.id = 'garden-coins';
  coinsValue.textContent = resources.coins;
  const coinsIcon = document.createElement('span');
  coinsIcon.textContent = ' 💰';
  
  coinsInfo.appendChild(coinsLabel);
  coinsInfo.appendChild(document.createTextNode(' '));
  coinsInfo.appendChild(coinsValue);
  coinsInfo.appendChild(coinsIcon);
  infoPanel.appendChild(coinsInfo);
  
  const seedsInfo = document.createElement('div');
  seedsInfo.className = 'info-item';
  const seedsLabel = document.createElement('strong');
  seedsLabel.textContent = 'Seeds:';
  const seedsValue = document.createElement('span');
  seedsValue.id = 'garden-seeds';
  seedsValue.textContent = resources.seeds;
  const seedsIcon = document.createElement('span');
  seedsIcon.className = 'seed-icon';
  seedsIcon.textContent = ' 🌰';
  
  seedsInfo.appendChild(seedsLabel);
  seedsInfo.appendChild(document.createTextNode(' '));
  seedsInfo.appendChild(seedsValue);
  seedsInfo.appendChild(seedsIcon);
  infoPanel.appendChild(seedsInfo);
  
  contentWrapper.appendChild(infoPanel);

  const mainContent = document.createElement('div');
  mainContent.className = 'garden-main-content';

  // Create garden grid first in mobile view
  const grid = document.createElement('div');
  grid.className = 'garden-plot-grid';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'garden-plot-cell';
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', 'Garden cell');
      
      const plot = garden[r][c];
      if (plot) {
        let stageKey = PLANTS[plot.type].stages[plot.stage];
        cell.innerHTML = window.GARDEN_SVGS[stageKey] || PLANTS[plot.type].icon || '🌱';
        if (plot.wilted) cell.classList.add('wilted');
        if (plot.watered) cell.classList.add('watered');
        cell.title = PLANTS[plot.type].name + ' - ' + (plot.wilted ? 'Wilted!' : stageKey);
        cell.setAttribute('aria-label', PLANTS[plot.type].name + ' ' + (plot.wilted ? 'Wilted!' : stageKey));
      } else {
        cell.innerHTML = window.GARDEN_SVGS.dirt || '~';
        cell.setAttribute('aria-label', 'Empty garden plot');
      }
      
      // Add both click and touchend event handlers for better mobile support
      cell.addEventListener('click', () => handleCellClick(r, c, container));
      cell.addEventListener('touchend', (e) => {
        e.preventDefault(); // Prevent double-tap zoom
        handleCellClick(r, c, container);
      });
      
      grid.appendChild(cell);
    }
  }
  mainContent.appendChild(grid);

  // Then add action buttons
  const actionsToolbar = document.createElement('div');
  actionsToolbar.className = 'garden-actions-toolbar';
  ['plant', 'water', 'harvest', 'remove'].forEach(tool => {
    const btn = document.createElement('button');
    btn.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
    btn.className = 'garden-action-btn' + (selectedTool === tool ? ' selected' : '');
    btn.setAttribute('aria-pressed', selectedTool === tool ? 'true' : 'false');
    
    // Add both click and touchend event handlers
    btn.addEventListener('click', () => {
      selectedTool = tool;
      renderGardenUI(container);
    });
    btn.addEventListener('touchend', (e) => {
      e.preventDefault(); // Prevent double-tap zoom 
      selectedTool = tool;
      renderGardenUI(container);
    });
    
    actionsToolbar.appendChild(btn);
  });
  mainContent.appendChild(actionsToolbar);

  // Add plant selection at the bottom
  if (selectedTool === 'plant') {
    const plantSelectionToolbar = document.createElement('div');
    plantSelectionToolbar.className = 'garden-plant-selection-toolbar';
    PLANTS.forEach((plant, idx) => {
      const plantItem = document.createElement('div');
      plantItem.className = 'garden-plant-item' + (selectedPlant === idx ? ' selected' : '');
      plantItem.title = plant.info;
      plantItem.setAttribute('role', 'button');
      plantItem.setAttribute('aria-pressed', selectedPlant === idx ? 'true' : 'false');
      
      // Add both click and touchend event handlers
      plantItem.addEventListener('click', () => {
        selectedPlant = idx;
        renderGardenUI(container);
      });
      plantItem.addEventListener('touchend', (e) => {
        e.preventDefault(); // Prevent double-tap zoom
        selectedPlant = idx;
        renderGardenUI(container);
      });
      
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
  
  // Enable sound effects for garden actions
  addSoundEffects(container);
}

// Add sound effects to garden actions
function addSoundEffects(container) {
  // Get the action buttons
  const plantBtn = container.querySelector('.garden-action-btn:nth-child(1)');
  const waterBtn = container.querySelector('.garden-action-btn:nth-child(2)');
  const harvestBtn = container.querySelector('.garden-action-btn:nth-child(3)');
  
  // Add sound effects when buttons are clicked
  if (plantBtn && window.soundManager) {
    plantBtn.addEventListener('click', () => {
      window.soundManager.play('garden-plant');
    });
  }
  
  if (waterBtn && window.soundManager) {
    waterBtn.addEventListener('click', () => {
      window.soundManager.play('garden-water');
    });
  }
  
  if (harvestBtn && window.soundManager) {
    harvestBtn.addEventListener('click', () => {
      window.soundManager.play('garden-harvest');
    });
  }
}

// Modified cell click handler to include sound effects
function handleCellClick(r, c, container) {
  const plot = garden[r][c];
  
  if (selectedTool === 'plant' && !plot && resources.seeds > 0) {
    garden[r][c] = { type: selectedPlant, stage: 0, watered: false, wilted: false, days: 0 };
    resources.seeds--;
    
    // Play planting sound
    if (window.soundManager) {
      window.soundManager.play('garden-plant');
    }
  } else if (selectedTool === 'water' && plot && !plot.wilted && !plot.watered && resources.water > 0) {
    plot.watered = true;
    resources.water--;
    
    // Play watering sound
    if (window.soundManager) {
      window.soundManager.play('garden-water');
    }
  } else if (selectedTool === 'harvest' && plot && plot.stage === PLANTS[plot.type].stages.length - 1 && !plot.wilted) {
    resources.coins += PLANTS[plot.type].name === 'Mushroom' ? 3 : 2;
    resources.seeds += PLANTS[plot.type].name === 'Lavender' ? 2 : 1;
    garden[r][c] = null;
    
    // Play harvesting sound
    if (window.soundManager) {
      window.soundManager.play('garden-harvest');
    }
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

// Add garden sound effects
function initializeGarden(windowNode) {
  // ... existing initialization code ...
  
  // Add planting sound
  function playPlantingSound() {
    if (window.soundManager) {
      window.soundManager.play('garden-plant');
    }
  }
  
  // Add watering sound
  function playWateringSound() {
    if (window.soundManager) {
      window.soundManager.play('garden-water');
    }
  }
  
  // Add harvesting sound
  function playHarvestingSound() {
    if (window.soundManager) {
      window.soundManager.play('garden-harvest');
    }
  }
  
  // Integrate sounds with garden actions
  // This would need to be connected to your existing garden actions
  // For example:
  
  // For planting:
  gardenContainer.addEventListener('plant', function(e) {
    playPlantingSound();
  });
  
  // For watering:
  gardenContainer.addEventListener('water', function(e) {
    playWateringSound();
  });
  
  // For harvesting:
  gardenContainer.addEventListener('harvest', function(e) {
    playHarvestingSound();
  });
  
  // If you have buttons for these actions:
  const plantButtons = windowNode.querySelectorAll('.plant-button');
  plantButtons.forEach(button => {
    button.addEventListener('click', playPlantingSound);
  });
  
  const waterButtons = windowNode.querySelectorAll('.water-button');
  waterButtons.forEach(button => {
    button.addEventListener('click', playWateringSound);
  });
  
  const harvestButtons = windowNode.querySelectorAll('.harvest-button');
  harvestButtons.forEach(button => {
    button.addEventListener('click', playHarvestingSound);
  });
  
  // ... rest of existing code ...
} 