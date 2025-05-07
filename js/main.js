// CottagOS Main Script
document.addEventListener('DOMContentLoaded', function() {
  // Load and apply saved settings
  applySavedSettings();
  
  // Initialize time-based theme
  initializeTheme();
  
  // Setup clock
  updateClock();
  setInterval(updateClock, 60000); // Update every minute
  
  // Create ambient elements
  createDandelionSeeds();
  createButterflies();
  
  // Add desktop icons click events
  initializeDesktopIcons();
  
  // Initialize theme toggle
  initializeThemeToggle();
  
  // Initialize topbar actions
  initializeTopbarActions();
  
  // Create folder for cursor images
  createFolderIfNeeded('assets/cursors');
});

// Initialize Theme based on time of day
function initializeTheme() {
  const hour = new Date().getHours();
  if (hour >= 19 || hour < 6) {
    document.body.classList.add('night-mode');
    document.getElementById('theme-toggle').classList.add('night');
  }
}

// Update the clock in the taskbar
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  // Convert to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  document.querySelector('.pocket-watch .time').textContent = `${hours}:${minutes}`;
}

// Create floating dandelion seeds
function createDandelionSeeds() {
  const container = document.getElementById('dandelion-seeds');
  const numberOfSeeds = 15;
  
  for (let i = 0; i < numberOfSeeds; i++) {
    setTimeout(() => {
      const seed = document.createElement('div');
      seed.classList.add('seed');
      
      // Random starting position at the bottom of the screen
      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight - Math.random() * 100;
      
      seed.style.left = `${startX}px`;
      seed.style.top = `${startY}px`;
      
      // Random drift direction and rotation
      seed.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 300}px`);
      seed.style.setProperty('--drift-y', `-${Math.random() * 300 + 100}px`);
      seed.style.setProperty('--drift-rotate', `${Math.random() * 720 - 360}deg`);
      
      container.appendChild(seed);
      
      // Remove seed after animation completes
      setTimeout(() => {
        seed.remove();
        createSingleDandelionSeed(); // Create a new seed to replace it
      }, 15000);
    }, i * 1000); // Stagger the creation of seeds
  }
}

// Create a single dandelion seed (for replacement)
function createSingleDandelionSeed() {
  const container = document.getElementById('dandelion-seeds');
  const seed = document.createElement('div');
  seed.classList.add('seed');
  
  // Random starting position at the bottom of the screen
  const startX = Math.random() * window.innerWidth;
  const startY = window.innerHeight - Math.random() * 100;
  
  seed.style.left = `${startX}px`;
  seed.style.top = `${startY}px`;
  
  // Random drift direction and rotation
  seed.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 300}px`);
  seed.style.setProperty('--drift-y', `-${Math.random() * 300 + 100}px`);
  seed.style.setProperty('--drift-rotate', `${Math.random() * 720 - 360}deg`);
  
  container.appendChild(seed);
  
  // Remove seed after animation completes
  setTimeout(() => {
    seed.remove();
    createSingleDandelionSeed(); // Create a new seed to replace it
  }, 15000);
}

// Create butterflies
function createButterflies() {
  const container = document.getElementById('butterflies');
  const numberOfButterflies = 3;
  
  for (let i = 0; i < numberOfButterflies; i++) {
    const butterfly = document.createElement('div');
    butterfly.classList.add('butterfly');
    
    // Create butterfly parts
    const leftWing = document.createElement('div');
    leftWing.classList.add('wing', 'left');
    leftWing.style.backgroundColor = getRandomButterflyColor();
    
    const rightWing = document.createElement('div');
    rightWing.classList.add('wing', 'right');
    rightWing.style.backgroundColor = leftWing.style.backgroundColor;
    
    const body = document.createElement('div');
    body.classList.add('body');
    
    butterfly.appendChild(leftWing);
    butterfly.appendChild(rightWing);
    butterfly.appendChild(body);
    
    // Position randomly
    butterfly.style.left = `${Math.random() * window.innerWidth}px`;
    butterfly.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
    
    container.appendChild(butterfly);
    
    // Animate butterfly path
    animateButterfly(butterfly);
  }
}

// Get random butterfly wing color
function getRandomButterflyColor() {
  const colors = [
    'rgba(255, 223, 186, 0.8)', // Peach
    'rgba(173, 216, 230, 0.8)', // Light blue
    'rgba(221, 160, 221, 0.8)', // Plum
    'rgba(255, 222, 173, 0.8)', // Navajo white
    'rgba(152, 251, 152, 0.8)'  // Pale green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Animate butterfly with random movements
function animateButterfly(butterfly) {
  const speed = 2 + Math.random() * 3;
  const direction = {
    x: Math.random() > 0.5 ? 1 : -1,
    y: Math.random() > 0.5 ? 1 : -1
  };
  
  let position = {
    x: parseInt(butterfly.style.left),
    y: parseInt(butterfly.style.top)
  };
  
  function updatePosition() {
    // Randomly change direction occasionally
    if (Math.random() < 0.02) {
      direction.x *= -1;
    }
    if (Math.random() < 0.02) {
      direction.y *= -1;
    }
    
    // Update position
    position.x += speed * direction.x;
    position.y += speed * direction.y * 0.5; // Move slower vertically
    
    // Bounce off edges
    if (position.x < 0 || position.x > window.innerWidth - 20) {
      direction.x *= -1;
      position.x = Math.max(0, Math.min(position.x, window.innerWidth - 20));
    }
    
    if (position.y < 0 || position.y > window.innerHeight - 20) {
      direction.y *= -1;
      position.y = Math.max(0, Math.min(position.y, window.innerHeight - 20));
    }
    
    // Apply new position
    butterfly.style.left = `${position.x}px`;
    butterfly.style.top = `${position.y}px`;
    
    // Request next frame
    requestAnimationFrame(updatePosition);
  }
  
  // Start animation
  updatePosition();
}

// Initialize Desktop Icons
function initializeDesktopIcons() {
  const icons = document.querySelectorAll('.desktop-icon');
  const desktop = document.getElementById('desktop');

  // Load saved positions
  const savedPositions = JSON.parse(localStorage.getItem('desktopIconPositions') || '{}');
  icons.forEach(icon => {
    const app = icon.getAttribute('data-app');
    if (savedPositions[app]) {
      icon.style.position = 'absolute';
      icon.style.left = savedPositions[app].left;
      icon.style.top = savedPositions[app].top;
      icon.classList.add('draggable');
    }
  });

  icons.forEach(icon => {
    let dragTimer = null;
    let readyToDrag = false;
    let offsetX, offsetY, isDragging = false;

    icon.addEventListener('mousedown', function(e) {
      if (e.button !== 0) return; // Only left mouse
      readyToDrag = false;
      dragTimer = setTimeout(() => {
        readyToDrag = true;
        icon.classList.add('can-drag');
      }, 3000);
      offsetX = e.clientX;
      offsetY = e.clientY;
    });

    icon.addEventListener('mouseleave', function() {
      clearTimeout(dragTimer);
      readyToDrag = false;
      icon.classList.remove('can-drag');
    });

    icon.addEventListener('mouseup', function() {
      clearTimeout(dragTimer);
      if (!isDragging) {
        readyToDrag = false;
        icon.classList.remove('can-drag');
      }
    });

    icon.addEventListener('click', function(e) {
      // Prevent click if dragging
      if (icon.classList.contains('dragging')) return;
      const appName = this.getAttribute('data-app');
      openApp(appName);
    });

    icon.addEventListener('mousemove', function(e) {
      // Only start drag if readyToDrag is true and mouse is down
      if (readyToDrag && e.buttons === 1 && !isDragging) {
        isDragging = true;
        icon.classList.add('dragging', 'draggable');

        // Always get icon's position relative to desktop BEFORE moving
        const iconRect = icon.getBoundingClientRect();
        const desktopRect = desktop.getBoundingClientRect();
        const left = iconRect.left - desktopRect.left;
        const top = iconRect.top - desktopRect.top;

        // If icon is still inside a .desktop-row, move it to .desktop
        const desktopRow = icon.parentElement;
        if (desktopRow.classList.contains('desktop-row')) {
          icon.style.position = 'absolute';
          icon.style.left = left + 'px';
          icon.style.top = top + 'px';
          desktop.appendChild(icon);
        }

        offsetX = e.clientX - left;
        offsetY = e.clientY - top;
        document.body.style.userSelect = 'none';
      }
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      const desktopRect = desktop.getBoundingClientRect();
      let x = e.clientX - desktopRect.left - offsetX;
      let y = e.clientY - desktopRect.top - offsetY;
      // Clamp within desktop
      x = Math.max(0, Math.min(x, desktopRect.width - icon.offsetWidth));
      y = Math.max(0, Math.min(y, desktopRect.height - icon.offsetHeight));
      icon.style.left = x + 'px';
      icon.style.top = y + 'px';
    });

    document.addEventListener('mouseup', function(e) {
      if (!isDragging) return;
      isDragging = false;
      icon.classList.remove('dragging');
      icon.classList.remove('can-drag'); // Remove can-drag after drag
      clearTimeout(dragTimer);
      readyToDrag = false;
      // Save position
      const app = icon.getAttribute('data-app');
      const pos = { left: icon.style.left, top: icon.style.top };
      const allPositions = JSON.parse(localStorage.getItem('desktopIconPositions') || '{}');
      allPositions[app] = pos;
      localStorage.setItem('desktopIconPositions', JSON.stringify(allPositions));
      document.body.style.userSelect = '';
    });
  });
}

// Open Application
function openApp(appName) {
  // Check if app is already open
  if (document.querySelector(`.cottage-window[data-app="${appName}"]`)) {
    // Just focus the window if it's already open
    const windowManager = window.cottageOS?.windowManager;
    if (windowManager) {
      windowManager.focusWindow(document.querySelector(`.cottage-window[data-app="${appName}"]`));
    }
    return;
  }
  
  const windowManager = window.cottageOS?.windowManager;
  if (windowManager) {
    windowManager.createWindow(appName);
  }
}

// Initialize Theme Toggle
function initializeThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', function() {
    const isNight = document.body.classList.toggle('night-mode');
    if (isNight) {
      this.classList.add('night');
    } else {
      this.classList.remove('night');
    }
    // Also update settings in localStorage
    const settings = JSON.parse(localStorage.getItem('cottagosSettings') || '{}');
    settings.nightMode = isNight;
    localStorage.setItem('cottagosSettings', JSON.stringify(settings));
    updateAppIconsForTheme();
  });
}

// Initialize Topbar Actions
function initializeTopbarActions() {
  const topbarItems = document.querySelectorAll('.topbar-menu-item, .topbar-icon');
  
  topbarItems.forEach(item => {
    item.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      const windowManager = window.cottageOS?.windowManager;
      
      switch (action) {
        case 'help':
          if (windowManager) openApp('help'); // Use openApp to handle creation/focus
          break;
        case 'about':
          if (windowManager) openApp('about'); // Use openApp to handle creation/focus
          break;
        case 'recipes': // Using the book icon for recipes
          if (windowManager) {
            openApp('recipes'); // Reuse existing openApp function
          }
          break;
        default:
          console.log('Unknown topbar action:', action);
      }
    });
  });
}

// Create folder helper
function createFolderIfNeeded(folderPath) {
  // This is just a placeholder since we can't actually create folders in a browser-only app
  console.log('Would create folder if this was a Node.js app:', folderPath);
}

function applySavedSettings() {
  const settings = JSON.parse(localStorage.getItem('cottagosSettings') || '{}');
  if (settings.nightMode) document.body.classList.add('night-mode');
  else document.body.classList.remove('night-mode');
  if (settings.theme) document.documentElement.setAttribute('data-theme', settings.theme);
  if (settings.font) document.documentElement.setAttribute('data-font', settings.font);
  if (settings.cursor) document.body.setAttribute('data-cursor', settings.cursor);
  if (settings.volume !== undefined && window.cottageOS?.Ambient) {
    window.cottageOS.Ambient.setVolume(settings.volume);
  }
  if (settings.ambientSounds !== undefined && window.cottageOS?.Ambient) {
    window.cottageOS.Ambient.toggleAmbient(settings.ambientSounds);
  }
  updateAppIconsForTheme();
}

function updateAppIconsForTheme() {
  const isNight = document.body.classList.contains('night-mode');
  const iconMap = {
    syneva: 'syneva',
    terminal: 'terminal',
    settings: 'settings',
    mossbell: 'mossbell',
    garden: 'garden',
    weather: 'weather',
    recipes: 'recipes',
    fortune: 'fortune',
    'text-editor': 'text-editor',
    paint: 'paint'
  };
  // Desktop icons
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    const app = icon.getAttribute('data-app');
    const img = icon.querySelector('img');
    if (img && iconMap[app]) {
      img.src = isNight
        ? `assets/icons/${iconMap[app]}-dark.svg`
        : `assets/icons/${iconMap[app]}.svg`;
    }
  });
  // Taskbar icons
  document.querySelectorAll('.taskbar-app').forEach(appEl => {
    const app = appEl.getAttribute('data-app');
    const img = appEl.querySelector('img');
    if (img && iconMap[app]) {
      img.src = isNight
        ? `assets/icons/${iconMap[app]}-dark.svg`
        : `assets/icons/${iconMap[app]}.svg`;
    }
  });
}
