// CottagOS Window Manager
class WindowManager {
  constructor() {
    this.windowTemplate = document.getElementById('window-template');
    this.windowContainer = document.getElementById('window-container');
    this.taskbarApps = document.getElementById('taskbar-apps');
    this.windowZIndex = 100;
    this.openWindows = [];
    
    // Initialize drag and resize handlers
    this.initializeDragHandlers();
  }
  
  createWindow(appName) {
    // Clone window template
    const windowNode = this.windowTemplate.content.cloneNode(true).querySelector('.cottage-window');
    windowNode.setAttribute('data-app', appName);
    
    // Set window title based on app
    this.setWindowProperties(windowNode, appName);
    
    // Load app content template
    this.loadAppContent(windowNode, appName);
    
    // Add window to container
    this.windowContainer.appendChild(windowNode);
    
    // Add to open windows
    this.openWindows.push({
      id: Date.now(),
      element: windowNode,
      appName: appName
    });
    
    // Add to taskbar
    this.addToTaskbar(appName, windowNode);
    
    // Make this window active
    this.focusWindow(windowNode);
    
    // Initialize position (center on screen with random offset)
    const maxOffset = 50;
    const offsetX = Math.floor(Math.random() * maxOffset);
    const offsetY = Math.floor(Math.random() * maxOffset);
    
    const windowWidth = parseInt(windowNode.style.width) || 400;
    const windowHeight = parseInt(windowNode.style.height) || 300;
    
    const centerX = (window.innerWidth - windowWidth) / 2;
    const centerY = (window.innerHeight - windowHeight) / 2;
    
    windowNode.style.left = `${Math.max(centerX + offsetX, 0)}px`;
    windowNode.style.top = `${Math.max(centerY + offsetY, 50)}px`;
    
    // Initialize window controls
    this.initializeWindowControls(windowNode);
    
    // Initialize app specific functionality
    this.initializeAppFunctionality(windowNode, appName);
    
    return windowNode;
  }
  
  setWindowProperties(windowNode, appName) {
    // Set title and icon based on app name
    const titleElement = windowNode.querySelector('.window-title');
    
    switch (appName) {
      case 'syneva':
        titleElement.textContent = 'SYNEVA Chat';
        windowNode.style.width = '800px';
        windowNode.style.height = '600px';
        break;
      case 'mossbell':
        titleElement.textContent = 'Mossbell Pet';
        windowNode.style.width = '400px';
        windowNode.style.height = '520px';
        break;
      case 'garden':
        titleElement.textContent = 'Garden Planner';
        windowNode.style.width = '900px';
        windowNode.style.height = '700px';
        // Initialize the new garden planner game in the .garden-game container
        setTimeout(() => {
          const gameContainer = windowNode.querySelector('.garden-game');
          if (window.initGardenPlanner && gameContainer) {
            window.initGardenPlanner(gameContainer);
          }
        }, 0);
        break;
      case 'weather':
        titleElement.textContent = 'Weather Widget';
        windowNode.style.width = '350px';
        windowNode.style.height = '500px';
        break;
      case 'recipes':
        titleElement.textContent = 'Hearthfire Recipes';
        windowNode.style.width = '550px';
        windowNode.style.height = '600px';
        break;
      case 'terminal':
        titleElement.textContent = 'Starlight Terminal';
        windowNode.style.width = '800px';
        windowNode.style.height = '600px';
        break;
      case 'settings':
        titleElement.textContent = 'Settings Cottage';
        windowNode.style.width = '400px';
        windowNode.style.height = '500px';
        break;
      case 'fortune':
        titleElement.textContent = "Fortuna's Lens";
        windowNode.style.width = '450px';
        windowNode.style.height = '600px';
        break;
      case 'help':
        titleElement.textContent = 'Help';
        windowNode.style.width = '450px';
        windowNode.style.height = '350px';
        break;
      case 'about':
        titleElement.textContent = 'About CottagOS';
        windowNode.style.width = '400px';
        windowNode.style.height = '300px';
        break;
      case 'text-editor':
        titleElement.textContent = 'Parchment Notes';
        windowNode.style.width = '800px';
        windowNode.style.height = '600px';
        break;
      case 'paint':
        titleElement.textContent = 'Wildflower Paint';
        windowNode.style.width = '900px';
        windowNode.style.height = '700px';
        break;
      default:
        titleElement.textContent = 'CottagOS Window';
        windowNode.style.width = '400px';
        windowNode.style.height = '300px';
    }
  }
  
  loadAppContent(windowNode, appName) {
    const contentContainer = windowNode.querySelector('.window-content');
    const templateId = `${appName}-template`;
    const template = document.getElementById(templateId);
    
    if (template) {
      contentContainer.appendChild(template.content.cloneNode(true));
    } else {
      contentContainer.innerHTML = `<div class="flex items-center justify-center h-full">
        <p class="text-cottage-sepia font-cormorant text-lg">Loading ${appName}...</p>
      </div>`;
    }
  }
  
  addToTaskbar(appName, windowNode) {
    // Create taskbar entry
    const taskbarApp = document.createElement('div');
    taskbarApp.classList.add('taskbar-app');
    taskbarApp.setAttribute('data-app', appName);
    
    // Icon
    const icon = document.createElement('img');
    icon.src = `assets/icons/${appName}.svg`;
    icon.alt = appName;
    
    taskbarApp.appendChild(icon);
    this.taskbarApps.appendChild(taskbarApp);
    updateAppIconsForTheme && updateAppIconsForTheme();
    
    // Click event to focus window or restore if minimized
    taskbarApp.addEventListener('click', () => {
      if (windowNode.style.display === 'none') {
        windowNode.style.display = 'block';
      }
      this.focusWindow(windowNode);
    });
  }
  
  focusWindow(windowElement) {
    // Set active class on window
    const windows = document.querySelectorAll('.cottage-window');
    windows.forEach(w => w.classList.remove('active'));
    windowElement.classList.add('active');
    
    // Update taskbar active status
    const taskbarApps = document.querySelectorAll('.taskbar-app');
    taskbarApps.forEach(t => t.classList.remove('active'));
    const appName = windowElement.getAttribute('data-app');
    const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
    if (taskbarApp) {
      taskbarApp.classList.add('active');
    }
    
    // Bring to front
    windowElement.style.zIndex = ++this.windowZIndex;
  }
  
  closeWindow(windowElement) {
    const appName = windowElement.getAttribute('data-app');
    
    // Remove from open windows
    this.openWindows = this.openWindows.filter(w => w.element !== windowElement);
    
    // Remove from taskbar
    const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
    if (taskbarApp) {
      taskbarApp.remove();
    }
    
    // Remove the window
    windowElement.remove();
  }
  
  initializeWindowControls(windowElement) {
    const closeButton = windowElement.querySelector('.window-close');
    const minimizeButton = windowElement.querySelector('.window-minimize');
    
    closeButton.addEventListener('click', () => {
      this.closeWindow(windowElement);
    });
    
    minimizeButton.addEventListener('click', () => {
      this.minimizeWindow(windowElement);
    });
  }
  
  minimizeWindow(windowElement) {
    // Simple implementation - just hide the window temporarily
    windowElement.style.display = 'none';
    
    // Remove active class from taskbar
    const appName = windowElement.getAttribute('data-app');
    const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
    if (taskbarApp) {
      taskbarApp.classList.remove('active');
    }
  }
  
  initializeDragHandlers() {
    // Delegation for drag events
    this.windowContainer.addEventListener('mousedown', (e) => {
      const titlebar = e.target.closest('.window-titlebar');
      if (!titlebar) return;
      
      const window = titlebar.closest('.cottage-window');
      if (!window) return;
      
      this.focusWindow(window);
      
      // Starting drag positions
      const startX = e.clientX;
      const startY = e.clientY;
      const windowRect = window.getBoundingClientRect();
      const startLeft = windowRect.left;
      const startTop = windowRect.top;
      
      // Add flower petals trailing effect on drag
      let lastPetalTime = 0;
      const containerRect = this.windowContainer.getBoundingClientRect(); // Get container bounds
      const topBarHeight = document.getElementById('topbar')?.offsetHeight || 50; // Get actual topbar height or default
      
      const dragMove = (moveEvent) => {
        // Calculate target absolute position (relative to viewport)
        const targetLeft = startLeft + (moveEvent.clientX - startX);
        const targetTop = startTop + (moveEvent.clientY - startY);
        
        // Define allowed viewport boundaries based on the container
        const minAllowedLeft = containerRect.left;
        const maxAllowedLeft = containerRect.right - window.offsetWidth;
        const minAllowedTop = containerRect.top + topBarHeight; // Minimum top is below topbar
        const maxAllowedTop = containerRect.bottom - window.offsetHeight;
        
        // Clamp the target position to stay within allowed boundaries
        const clampedLeft = Math.max(minAllowedLeft, Math.min(targetLeft, maxAllowedLeft));
        const clampedTop = Math.max(minAllowedTop, Math.min(targetTop, maxAllowedTop));
        
        // Convert clamped viewport coordinates back to coordinates relative to the container
        window.style.left = `${clampedLeft - containerRect.left}px`;
        window.style.top = `${clampedTop - containerRect.top}px`;
        
        // Add petal effect occasionally
        const now = Date.now();
        if (now - lastPetalTime > 150) { // Limit petal creation rate
          createDragPetal(moveEvent.clientX, moveEvent.clientY);
          lastPetalTime = now;
        }
      };
      
      const dragEnd = () => {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
      };
      
      // Create a flower petal at mouse position
      const createDragPetal = (x, y) => {
        const petal = document.createElement('div');
        petal.classList.add('drag-petal');
        petal.style.left = `${x}px`;
        petal.style.top = `${y}px`;
        petal.style.backgroundColor = getRandomPetalColor();
        
        // Random rotation and size
        const rotation = Math.random() * 360;
        const scale = 0.5 + Math.random() * 0.5;
        petal.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        
        // Add to body
        document.body.appendChild(petal);
        
        // Animate and remove
        setTimeout(() => {
          petal.style.opacity = '0';
          petal.style.transform = `rotate(${rotation + 20}deg) scale(${scale * 0.8}) translate(0, 20px)`;
          
          setTimeout(() => {
            petal.remove();
          }, 500);
        }, 100);
      };
      
      // Get random petal color
      const getRandomPetalColor = () => {
        const colors = [
          'var(--cottage-rose)',
          'var(--cottage-lavender)',
          'var(--cottage-sage)',
          'var(--cottage-goldenrod)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      };
      
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
    });
    
    // Delegation for resize events
    this.windowContainer.addEventListener('mousedown', (e) => {
      const resizeHandle = e.target.closest('.resize-handle');
      if (!resizeHandle) return;
      
      const window = resizeHandle.closest('.cottage-window');
      if (!window) return;
      
      this.focusWindow(window);
      
      // Starting resize positions
      const startX = e.clientX;
      const startY = e.clientY;
      const windowRect = window.getBoundingClientRect();
      const startWidth = windowRect.width;
      const startHeight = windowRect.height;
      
      const resizeMove = (moveEvent) => {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        const newHeight = startHeight + (moveEvent.clientY - startY);
        
        // Minimum size
        const minWidth = 200;
        const minHeight = 150;
        
        window.style.width = `${Math.max(minWidth, newWidth)}px`;
        window.style.height = `${Math.max(minHeight, newHeight)}px`;
      };
      
      const resizeEnd = () => {
        document.removeEventListener('mousemove', resizeMove);
        document.removeEventListener('mouseup', resizeEnd);
      };
      
      document.addEventListener('mousemove', resizeMove);
      document.addEventListener('mouseup', resizeEnd);
    });
  }
  
  initializeAppFunctionality(windowNode, appName) {
    switch (appName) {
      case 'syneva':
        if (typeof initSyneva === 'function') {
          initSyneva(windowNode);
        }
        break;
      case 'mossbell':
        this.initMossbell(windowNode);
        break;
      case 'weather':
        this.initWeather(windowNode);
        break;
      case 'garden':
        this.initGarden(windowNode);
        break;
      case 'recipes':
        this.initRecipes(windowNode);
        break;
      case 'settings':
        this.initSettings(windowNode);
        break;
      case 'fortune':
        this.initFortune(windowNode);
        break;
      case 'text-editor':
        // Mount the text editor app
        setTimeout(() => {
          const mountNode = windowNode.querySelector('.text-editor-mount');
          if (window.initCottagecoreTextEditor && mountNode) {
            window.initCottagecoreTextEditor(mountNode);
          }
        }, 0);
        break;
      case 'paint':
        setTimeout(() => {
          const mountNode = windowNode.querySelector('.cottagecore-paint-app');
          if (window.initCottagecorePaintApp && mountNode) {
            window.initCottagecorePaintApp(mountNode);
          }
        }, 0);
        break;
      // Add initialization for other apps as needed
    }
  }
  
  // Initialize Weather Widget
  initWeather(windowNode) {
    const weatherAnimation = windowNode.querySelector('.weather-animation');
    const weatherStatus = windowNode.querySelector('#weather-status');
    const weatherTemp = windowNode.querySelector('#weather-temp');
    
    if (!weatherAnimation || !weatherStatus || !weatherTemp) return;
    
    // Random weather types
    const weatherTypes = ['sunny', 'cloudy', 'rain', 'snow', 'stormy'];
    const weatherDescriptions = {
      'sunny': 'Sunny Day',
      'cloudy': 'Cloudy Skies',
      'rain': 'Gentle Rain',
      'snow': 'Snow Flurries',
      'stormy': 'Thunderstorm'
    };
    
    // Set random weather
    function setRandomWeather() {
      const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      weatherAnimation.className = 'weather-animation ' + weatherType;
      weatherStatus.textContent = weatherDescriptions[weatherType];
      
      // Random temperature based on weather type
      let tempRange;
      switch (weatherType) {
        case 'sunny': tempRange = [70, 85]; break;
        case 'cloudy': tempRange = [60, 75]; break;
        case 'rain': tempRange = [50, 65]; break;
        case 'snow': tempRange = [25, 35]; break;
        case 'stormy': tempRange = [45, 60]; break;
        default: tempRange = [65, 75];
      }
      
      const temp = Math.floor(tempRange[0] + Math.random() * (tempRange[1] - tempRange[0]));
      weatherTemp.textContent = `${temp}°F`;
      
      // Create weather elements
      createWeatherElements(weatherType, weatherAnimation);
    }
    
    // Create weather elements based on type
    function createWeatherElements(type, container) {
      // Clear existing elements
      const existingElements = container.querySelectorAll('.raindrop, .snowflake, .lightning');
      existingElements.forEach(el => el.remove());
      
      if (type === 'rain') {
        for (let i = 0; i < 20; i++) {
          const raindrop = document.createElement('div');
          raindrop.classList.add('raindrop');
          raindrop.style.left = `${Math.random() * 100}%`;
          raindrop.style.animationDelay = `${Math.random() * 1.5}s`;
          container.appendChild(raindrop);
        }
      } else if (type === 'snow') {
        for (let i = 0; i < 15; i++) {
          const snowflake = document.createElement('div');
          snowflake.classList.add('snowflake');
          snowflake.style.left = `${Math.random() * 100}%`;
          snowflake.style.top = `${Math.random() * 100}%`;
          snowflake.style.animationDelay = `${Math.random() * 8}s`;
          snowflake.style.setProperty('--drift-x', `${(Math.random() * 40 - 20)}px`);
          container.appendChild(snowflake);
        }
      } else if (type === 'stormy') {
        const lightning = document.createElement('div');
        lightning.classList.add('lightning');
        container.appendChild(lightning);
      }
    }
    
    // Set initial weather
    setRandomWeather();
    
    // Update weather every few minutes
    const weatherInterval = setInterval(setRandomWeather, 120000); // 2 minutes
    
    // Clear interval when window closes
    windowNode.addEventListener('DOMNodeRemoved', () => {
      clearInterval(weatherInterval);
    });
  }
  
  // Initialize Garden Planner
  initGarden(windowNode) {
    const gardenPlot = windowNode.querySelector('.garden-plot');
    const tools = windowNode.querySelectorAll('.garden-tool');
    const plants = windowNode.querySelectorAll('.plant-item');
    
    if (!gardenPlot || !tools.length || !plants.length) return;
    
    // Garden state
    const numberOfCells = 24; // Create a fixed number of cells
    let selectedTool = 'seed';
    let selectedPlant = 'tulip';
    
    // Create grid
    for (let i = 0; i < numberOfCells; i++) {
      const cell = document.createElement('div');
      cell.classList.add('garden-cell'); // Use correct class
      cell.dataset.index = i;
      cell.dataset.planted = 'false';
      cell.dataset.plant = '';
      cell.dataset.stage = '0';
      cell.dataset.watered = 'false';
      
      cell.addEventListener('click', () => {
        const updateCellClasses = (cellEl, data) => {
          cellEl.classList.removeWhere(cls => cls.startsWith('plant-') || cls.startsWith('stage-'));
          cellEl.classList.remove('planted', 'watered'); // Remove all state classes first

          if (data.planted === 'true') {
            cellEl.classList.add('planted', `plant-${data.plant}`, `stage-${data.stage}`);
          }
          if (data.watered === 'true') {
            cellEl.classList.add('watered');
          }
        };

        const cellData = cell.dataset;
        
        if (selectedTool === 'seed' && cellData.planted === 'false') {
          // Plant a seed
          cellData.planted = 'true';
          cellData.plant = selectedPlant;
          cellData.stage = '0';
          updateCellClasses(cell, cellData);
        } else if (selectedTool === 'water' && cellData.planted === 'true' && cellData.watered === 'false') {
          // Water the plant
          cellData.watered = 'true';
          updateCellClasses(cell, cellData); // Add .watered class

          // Plants grow after watering
          setTimeout(() => {
            const newStage = Math.min(parseInt(cellData.stage) + 1, 3); // Assuming max stage 3
            cellData.stage = newStage.toString();
            updateCellClasses(cell, cellData); // Update stage and remove .watered
            cellData.watered = 'false';
          }, 3000);
        } else if (selectedTool === 'harvest' && cellData.planted === 'true' && parseInt(cellData.stage) >= 3) {
          // Harvest the plant (keep data for effect)
          const harvestedPlant = cellData.plant; // Store before clearing
          cellData.planted = 'false';
          cellData.plant = '';
          cellData.stage = '0';
          cellData.watered = 'false';

          // Show harvest animation
          const harvest = document.createElement('div');
          harvest.classList.add('harvest-effect', `plant-${harvestedPlant}`);
          cell.appendChild(harvest);

          // Trigger CSS animation
          setTimeout(() => {
            harvest.classList.add('animate');

            setTimeout(() => {
              harvest.remove();
              updateCellClasses(cell, cellData); // Remove planted classes
            }, 500);
          }, 500);
        } else if (selectedTool === 'delete' && cellData.planted === 'true') {
          // Remove the plant
          cellData.planted = 'false';
          cellData.plant = '';
          cellData.stage = '0';
          cellData.watered = 'false';
          updateCellClasses(cell, cellData); // Remove planted classes
        }
      });

      gardenPlot.appendChild(cell);
    }

    // Tool selection
    tools.forEach(tool => {
      tool.addEventListener('click', () => {
        tools.forEach(t => t.classList.remove('selected')); // Use 'selected'
        tool.classList.add('selected'); // Use 'selected'
        selectedTool = tool.dataset.tool;
      });
    });

    // Set initial active tool
    tools[0].classList.add('selected'); // Use 'selected'

    // Plant selection
    plants.forEach(plant => {
      plant.addEventListener('click', () => {
        plants.forEach(p => p.classList.remove('selected')); // Use 'selected'
        plant.classList.add('selected'); // Use 'selected'
        selectedPlant = plant.dataset.plant;
      });
    });

    // Set initial active plant
    plants[0].classList.add('selected'); // Use 'selected'
  }
  
  // Initialize Recipe Book
  initRecipes(windowNode) {
    if (window.cottageOS?.RecipeBook?.initRecipes) {
      window.cottageOS.RecipeBook.initRecipes(windowNode);
    } else {
      console.error('Recipe Book functionality not found!');
    }
  }
  
  // Initialize Settings
  initSettings(windowNode) {
    const toggleSwitches = windowNode.querySelectorAll('.toggle-switch');
    const themeOptions = windowNode.querySelectorAll('.theme-option');
    const fontOptions = windowNode.querySelectorAll('.font-option');
    const cursorOptions = windowNode.querySelectorAll('.cursor-option');
    const sliderHandle = windowNode.querySelector('.slider-handle');
    const sliderTrack = windowNode.querySelector('.slider-track');
    const ambientToggle = windowNode.querySelector('.toggle-switch[data-setting="ambient-sounds"]');

    // Load saved settings
    const settings = JSON.parse(localStorage.getItem('cottagosSettings') || '{}');
    // Apply settings to UI and document
    if (settings.nightMode) document.body.classList.add('night-mode');
    if (settings.theme) document.documentElement.setAttribute('data-theme', settings.theme);
    if (settings.font) document.documentElement.setAttribute('data-font', settings.font);
    if (settings.cursor) document.body.setAttribute('data-cursor', settings.cursor);
    if (settings.volume !== undefined && sliderHandle && sliderTrack) {
      sliderHandle.style.left = `${settings.volume}%`;
    }
    if (settings.ambientSounds && ambientToggle) ambientToggle.classList.add('active');

    // Sync UI state
    themeOptions.forEach(opt => {
      if (settings.theme && opt.getAttribute('data-theme') === settings.theme) opt.classList.add('selected');
      else opt.classList.remove('selected');
    });
    fontOptions.forEach(opt => {
      if (settings.font && opt.getAttribute('data-font') === settings.font) opt.classList.add('selected');
      else opt.classList.remove('selected');
    });
    cursorOptions.forEach(opt => {
      if (settings.cursor && opt.getAttribute('data-cursor') === settings.cursor) opt.classList.add('selected');
      else opt.classList.remove('selected');
    });
    toggleSwitches.forEach(toggle => {
      const setting = toggle.getAttribute('data-setting');
      // Sync initial state
      if (setting === 'night-mode') {
        if (document.body.classList.contains('night-mode')) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }
      }
      if (setting === 'ambient-sounds') {
        if (settings.ambientSounds) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }
      }
      // Add event listener
      toggle.addEventListener('click', function() {
        if (setting === 'night-mode') {
          const isActive = toggle.classList.contains('active');
          if (isActive) {
            toggle.classList.remove('active');
            document.body.classList.remove('night-mode');
            settings.nightMode = false;
          } else {
            toggle.classList.add('active');
            document.body.classList.add('night-mode');
            settings.nightMode = true;
          }
          localStorage.setItem('cottagosSettings', JSON.stringify(settings));
        } else if (setting === 'ambient-sounds') {
          toggle.classList.toggle('active');
          settings.ambientSounds = toggle.classList.contains('active');
          // If ambient.js is present, toggle ambient sounds
          if (window.cottageOS?.Ambient) {
            window.cottageOS.Ambient.toggleAmbient(settings.ambientSounds);
          }
          localStorage.setItem('cottagosSettings', JSON.stringify(settings));
        }
      });
    });

    // Theme selection
    themeOptions.forEach(option => {
      option.addEventListener('click', function() {
        themeOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        const theme = this.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        settings.theme = theme;
        localStorage.setItem('cottagosSettings', JSON.stringify(settings));
      });
    });

    // Font selection
    fontOptions.forEach(option => {
      option.addEventListener('click', function() {
        fontOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        const font = this.getAttribute('data-font');
        document.documentElement.setAttribute('data-font', font);
        settings.font = font;
        localStorage.setItem('cottagosSettings', JSON.stringify(settings));
      });
    });

    // Cursor selection
    cursorOptions.forEach(option => {
      option.addEventListener('click', function() {
        cursorOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        const cursor = this.getAttribute('data-cursor');
        document.body.setAttribute('data-cursor', cursor);
        settings.cursor = cursor;
        localStorage.setItem('cottagosSettings', JSON.stringify(settings));
      });
    });

    // Slider functionality (Volume)
    if (sliderHandle && sliderTrack) {
      let isDragging = false;
      sliderHandle.addEventListener('mousedown', function(e) {
        isDragging = true;
        e.preventDefault();
      });
      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const trackRect = sliderTrack.getBoundingClientRect();
        const position = (e.clientX - trackRect.left) / trackRect.width;
        const clampedPosition = Math.max(0, Math.min(position, 1));
        sliderHandle.style.left = `${clampedPosition * 100}%`;
        settings.volume = Math.round(clampedPosition * 100);
        // If ambient.js is present, set volume
        if (window.cottageOS?.Ambient) {
          window.cottageOS.Ambient.setVolume(settings.volume);
        }
        localStorage.setItem('cottagosSettings', JSON.stringify(settings));
      });
      document.addEventListener('mouseup', function() {
        isDragging = false;
      });
    }
  }
  
  // Initialize Fortune Teller
  initFortune(windowNode) {
    const crystalBall = windowNode.querySelector('.crystal-ball');
    const fortuneText = windowNode.querySelector('.fortune-text');
    const fortuneButton = windowNode.querySelector('.fortune-button');
    const tarotCards = windowNode.querySelectorAll('.tarot-card');
    
    if (!crystalBall || !fortuneText || !fortuneButton) return;
    
    // Fortune phrases
    const subjects = [
      'The willow',
      'A distant star',
      'The old oak',
      'The morning mist',
      'A gentle breeze',
      'The full moon',
      'A secret garden',
      'The autumn leaf',
      'A hidden path',
      'The crystal stream'
    ];
    
    const verbs = [
      'whispers of',
      'reveals',
      'conceals',
      'guides you toward',
      'warns against',
      'celebrates',
      'remembers',
      'dreams about',
      'transforms into',
      'connects with'
    ];
    
    const objects = [
      'forgotten paths',
      'new beginnings',
      'unexpected journeys',
      'ancient wisdom',
      'hidden talents',
      'deep connections',
      'peaceful moments',
      'creative inspiration',
      'meaningful change',
      'heartfelt joy'
    ];
    
    // Generate random fortune
    function generateFortune() {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      const object = objects[Math.floor(Math.random() * objects.length)];
      
      return `${subject} ${verb} ${object}.`;
    }
    
    // Crystal ball click
    crystalBall.addEventListener('click', () => {
      fortuneText.textContent = generateFortune();
      fortuneText.classList.add('visible');
      
      // Animate crystal ball
      crystalBall.style.transform = 'scale(1.05)';
      setTimeout(() => {
        crystalBall.style.transform = 'scale(1)';
      }, 300);
    });
    
    // Fortune button click
    fortuneButton.addEventListener('click', () => {
      // Reveal fortune in crystal ball
      fortuneText.textContent = generateFortune();
      fortuneText.classList.add('visible');
      
      // Flip random tarot card
      const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
      
      // Reset all cards first
      tarotCards.forEach(card => {
        card.classList.remove('flipped');
      });
      
      // Then flip the selected card
      setTimeout(() => {
        randomCard.classList.add('flipped');
      }, 500);
    });
    
    // Tarot card click
    tarotCards.forEach(card => {
      card.addEventListener('click', function() {
        // Toggle flipped state
        this.classList.toggle('flipped');
      });
    });
  }
  
  initMossbell(windowElement) {
    const mossbellPet = windowElement.querySelector('.mossbell-pet');
    const feedButton = windowElement.querySelector('.mossbell-button[data-action="feed"]');
    const playButton = windowElement.querySelector('.mossbell-button[data-action="play"]');
    const sleepButton = windowElement.querySelector('.mossbell-button[data-action="sleep"]');
    const statusElement = windowElement.querySelector('.mossbell-status'); // Optional status display

    // Center the main content
    windowElement.querySelector('.window-content').style.display = 'flex';
    windowElement.querySelector('.window-content').style.flexDirection = 'column';
    windowElement.querySelector('.window-content').style.alignItems = 'center';
    windowElement.querySelector('.window-content').style.justifyContent = 'center';

    // Add button labels if not present
    if (playButton && !playButton.nextElementSibling) {
      const playLabel = document.createElement('span');
      playLabel.textContent = 'Play';
      playLabel.className = 'mossbell-btn-label';
      playButton.parentNode.appendChild(playLabel);
    }
    if (feedButton && !feedButton.nextElementSibling) {
      const feedLabel = document.createElement('span');
      feedLabel.textContent = 'Feed';
      feedLabel.className = 'mossbell-btn-label';
      feedButton.parentNode.appendChild(feedLabel);
    }
    if (sleepButton && !sleepButton.nextElementSibling) {
      const sleepLabel = document.createElement('span');
      sleepLabel.textContent = 'Sleep';
      sleepLabel.className = 'mossbell-btn-label';
      sleepButton.parentNode.appendChild(sleepLabel);
    }

    // Add a stylized border to the main pet screen
    const petScreen = windowElement.querySelector('.mossbell-screen');
    if (petScreen) {
      petScreen.style.border = '4px solid #a17f6c';
      petScreen.style.borderRadius = '18px';
      petScreen.style.background = 'linear-gradient(135deg, #fdf6e3 80%, #e7c4b5 100%)';
      petScreen.style.boxShadow = '0 4px 24px #e7c4b5';
      petScreen.style.margin = '18px 0';
    }

    // Add Tamagotchi-style device background
    windowElement.querySelector('.window-content').style.background = 'radial-gradient(circle at 60% 40%, #ffe44b 60%, #e7c4b5 100%)';
    windowElement.querySelector('.window-content').style.borderRadius = '40% 40% 40% 40% / 55% 55% 45% 45%';
  }
}

// Initialize Window Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create global namespace
  window.cottageOS = window.cottageOS || {};
  window.cottageOS.windowManager = new WindowManager();
});

// Add CSS for drag petals (this could go in main CSS too)
const petalStyles = document.createElement('style');
petalStyles.textContent = `
  .drag-petal {
    position: fixed;
    width: 15px;
    height: 15px;
    background-color: var(--cottage-rose);
    border-radius: 50% 50% 0 50%;
    opacity: 0.7;
    pointer-events: none;
    z-index: 1000;
    transition: all 0.5s ease-out;
  }
`;
document.head.appendChild(petalStyles);

function initSyneva(windowElement) {
  const synevaInput = windowElement.querySelector('.syneva-input');
  const synevaOutput = windowElement.querySelector('.syneva-output');

  // Initialize SYNEVA directly since it's already loaded in the browser
  if (typeof window.initSyneva === 'function') {
    window.initSyneva(windowElement);
  } else {
    console.error('SYNEVA initialization function not found!');
  }
}

function initMossbell(windowElement) {
  const mossbellPet = windowElement.querySelector('.mossbell-pet');
  const feedButton = windowElement.querySelector('.mossbell-button[data-action="feed"]');
  const playButton = windowElement.querySelector('.mossbell-button[data-action="play"]');
  const sleepButton = windowElement.querySelector('.mossbell-button[data-action="sleep"]');
  const statusElement = windowElement.querySelector('.mossbell-status'); // Optional status display

  if (!mossbellPet || !feedButton || !playButton) {
    console.error('Mossbell elements not found!');
    return;
  }
  
  // Pet state (basic example)
  let petState = {
    hunger: 3,
    happiness: 3,
    lastAction: 'none'
  };

  function triggerReaction() {
    // Remove previous animation class if present, then add
    mossbellPet.classList.remove('reacting');
    // Force reflow/repaint before adding the class again
    void mossbellPet.offsetWidth;
    mossbellPet.classList.add('reacting');
  }
  
  // Remove animation class when done
  mossbellPet.addEventListener('animationend', () => {
    if (mossbellPet.classList.contains('reacting')) {
       mossbellPet.classList.remove('reacting');
    }
  });

  feedButton.addEventListener('click', () => {
    console.log('Feeding Mossbell...');
    petState.hunger = Math.max(0, petState.hunger - 1);
    petState.lastAction = 'feed';
    triggerReaction();
    // TODO: Update statusElement if needed
  });

  playButton.addEventListener('click', () => {
    console.log('Playing with Mossbell...');
    petState.happiness = Math.min(5, petState.happiness + 1);
    petState.lastAction = 'play';
    triggerReaction();
    // TODO: Update statusElement if needed
  });

  // Initial status update (optional)
  // if (statusElement) statusElement.textContent = "Mossbell is content.";
}
