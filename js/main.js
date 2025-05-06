// CottagOS Main Script
document.addEventListener('DOMContentLoaded', function() {
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
  
  icons.forEach(icon => {
    icon.addEventListener('click', function() {
      const appName = this.getAttribute('data-app');
      openApp(appName);
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
    document.body.classList.toggle('night-mode');
    this.classList.toggle('night');
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
