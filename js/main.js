// CottagOS Main Script
document.addEventListener('DOMContentLoaded', function() {
  // Load and apply saved settings
  applySavedSettings();
  
  // Initialize time-based theme
  initializeTheme();
  
  // Setup clock
  updateClock();
  setInterval(updateClock, 10000); // Update every 10 seconds
  
  // Create ambient elements
  createDandelionSeeds();
  createButterflies();
  
  // Add desktop icons click events
  initializeDesktopIcons();
  
  // Initialize theme toggle
  initializeThemeToggle();
  
  // Initialize topbar actions
  initializeTopbarActions();
  
  // Initialize font selector
  initializeFontSelector();
  
  // Create folder for cursor images
  createFolderIfNeeded('assets/cursors');

  // Mobile app launcher logic
  const mobileLauncher = document.querySelector('.mobile-launcher');
  const mobileModal = document.querySelector('.mobile-app-modal');
  if (mobileLauncher && mobileModal) {
    mobileLauncher.addEventListener('click', function(e) {
      const btn = e.target.closest('.mobile-app-icon');
      if (!btn) return;
      const appName = btn.getAttribute('data-app');
      if (!appName) return;
      // Hide launcher, show modal
      mobileLauncher.style.display = 'none';
      mobileModal.innerHTML = '';
      mobileModal.classList.add('active');
      // Clone the app template and insert into modal
      const template = document.getElementById(appName + '-template');
      if (template) {
        // Wrap in a div for styling
        const modalContent = document.createElement('div');
        modalContent.className = 'mobile-app-modal-content';
        modalContent.appendChild(template.content.cloneNode(true));
        mobileModal.appendChild(modalContent);
      } else {
        mobileModal.innerHTML = `<div class='mobile-app-modal-content'><p style='padding:2em;text-align:center;'>Loading ${appName}...</p></div>`;
      }
    });
  }

  // Show new mobile home, hide old launcher (if present)
  if (document.body.classList.contains('mobile-mode')) {
    console.log('Mobile mode detected. Setting up mobile home...'); // DEBUG
    const mobileHome = document.querySelector('.mobile-home');
    const mobileLauncher = document.querySelector('.mobile-launcher');
    if (mobileHome) {
      mobileHome.style.display = 'flex';
      console.log('.mobile-home display set to flex.'); // DEBUG
      // Attach the handler IMMEDIATELY after showing
      attachMobileHomeAppHandler();
    } else {
      console.error('.mobile-home element not found!'); // DEBUG Error
    }
    if (mobileLauncher) {
       mobileLauncher.style.display = 'none';
    }
  } else {
     console.log('Not in mobile mode.'); // DEBUG
  }

  // Mobile home screen swipe navigation
  const mobilePages = document.querySelector('.mobile-pages');
  if (mobilePages) {
    let startX = 0;
    let scrollStart = 0;
    let isTouching = false;
    let pageWidth = mobilePages.offsetWidth;
    let currentPage = 0;
    const pages = Array.from(mobilePages.children);
    const totalPages = pages.length;

    function goToPage(idx) {
      currentPage = Math.max(0, Math.min(idx, totalPages - 1));
      mobilePages.scrollTo({ left: currentPage * pageWidth, behavior: 'smooth' });
    }

    mobilePages.addEventListener('touchstart', function(e) {
      if (e.touches.length !== 1) return;
      isTouching = true;
      startX = e.touches[0].clientX;
      scrollStart = mobilePages.scrollLeft;
      pageWidth = mobilePages.offsetWidth;
    });
    mobilePages.addEventListener('touchmove', function(e) {
      if (!isTouching) return;
      const dx = e.touches[0].clientX - startX;
      mobilePages.scrollLeft = scrollStart - dx;
    });
    mobilePages.addEventListener('touchend', function(e) {
      if (!isTouching) return;
      isTouching = false;
      pageWidth = mobilePages.offsetWidth;
      const page = Math.round(mobilePages.scrollLeft / pageWidth);
      goToPage(page);
    });
    // Optional: snap to page on resize
    window.addEventListener('resize', () => {
      pageWidth = mobilePages.offsetWidth;
      goToPage(currentPage);
    });
  }

  // At the end, initialize mobile drag & drop and icon remove if in mobile mode
  if (document.body.classList.contains('mobile-mode')) {
    initializeMobileIconDragAndDrop();
    initializeMobileIconRemove();
    
    // Initialize mobile night mode toggle
    initializeMobileNightModeToggle();
  }

  // Handle mobile app modal closing (to detect when settings is closed/opened)
  if (mobileModal) {
    // Watch for changes to the modal to detect when settings is opened
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // Check if settings app was opened
          const settingsContainer = mobileModal.querySelector('.settings-container');
          if (settingsContainer) {
            setupMobileNightModeToggle();
          }
        }
      }
    });
    observer.observe(mobileModal, { childList: true, subtree: true });
  }

  // Play system startup sound
  if (window.soundManager) {
    window.soundManager.play('system-startup');
    // Initial BGM play is handled within SoundManager.init()
  }

  // Add theme toggle sound - only add the sound play, switching is in initializeThemeToggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle && window.soundManager) {
    themeToggle.addEventListener('click', function() {
      // Play the toggle sound - BGM handled by initializeThemeToggle
      window.soundManager.play('theme-toggle');
    });
  }

  // Add desktop icon click sounds
  if (window.soundManager) {
    // Desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('click', function() {
        window.soundManager.play('icon-click');
      });
    });
    
    // Mobile app icons
    document.querySelectorAll('.mobile-app-icon, .mobile-dock-icon').forEach(icon => {
      icon.addEventListener('click', function() {
        window.soundManager.play('icon-click');
      });
    });
  }

  // Add typing sound to text inputs
  if (window.soundManager) {
    document.addEventListener('input', function(e) {
      if (e.target.tagName === 'INPUT' && e.target.type === 'text' || 
          e.target.tagName === 'TEXTAREA') {
        window.soundManager.startTypingSound();
      }
    });
  }

  // Add button click sounds
  if (window.soundManager) {
    document.addEventListener('click', function(e) {
      // Only play button-click sound for settings elements
      const isSettingsElement = e.target.closest('.settings-container') && 
                               (e.target.tagName === 'BUTTON' || 
                                e.target.classList.contains('button') || 
                                e.target.closest('button') ||
                                e.target.closest('.button') ||
                                e.target.classList.contains('toggle-switch') || 
                                e.target.closest('.toggle-switch') ||
                                e.target.classList.contains('theme-option') ||
                                e.target.closest('.theme-option') ||
                                e.target.classList.contains('font-option') ||
                                e.target.closest('.font-option') ||
                                e.target.classList.contains('cursor-option') ||
                                e.target.closest('.cursor-option'));
                      
      if (isSettingsElement) {
        window.soundManager.play('button-click');
      }
      
      // Note: Desktop icon click sounds are already handled separately
      // in the desktop icon click event handlers above
    });
  }
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
  
  // Update all time displays in the document
  const timeElements = document.querySelectorAll('.pocket-watch .time');
  if (timeElements && timeElements.length > 0) {
    timeElements.forEach(element => {
      element.textContent = `${hours}:${minutes}`;
    });
  }
  
  // Also update Mossbell clock if it exists
  const mossClockElement = document.getElementById('moss-clock');
  if (mossClockElement) {
    mossClockElement.textContent = `${hours}:${minutes}${ampm}`;
  }
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
    // First, toggle the class on the body and the button itself
    const isNowNight = document.body.classList.toggle('night-mode');
    this.classList.toggle('night', isNowNight);

    // Play the toggle sound
    if (window.soundManager) {
      window.soundManager.play('theme-toggle');
    }

    // Determine the theme string for BGM
    const themeForBGM = isNowNight ? 'night' : 'day';
    console.log(`Theme toggled. isNowNight: ${isNowNight}. Playing BGM: ${themeForBGM}`); // Debug log

    // Switch BGM
    if (window.soundManager) {
      window.soundManager.playBGM(themeForBGM);
    }
    
    // Also update settings in localStorage
    const settings = JSON.parse(localStorage.getItem('cottagosSettings') || '{}');
    settings.nightMode = isNowNight;
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

// Initialize event handlers for font selection
function initializeFontSelector() {
  document.addEventListener('windowOpened', function(event) {
    if (event.detail.app === 'settings') {
      const fontOptions = document.querySelectorAll('.font-option');
      if (fontOptions.length > 0) {
        // First, mark the correct option as selected based on current setting
        const currentFont = document.documentElement.getAttribute('data-font') || 'quicksand';
        fontOptions.forEach(option => {
          option.classList.remove('selected');
          if (option.getAttribute('data-font') === currentFont) {
            option.classList.add('selected');
          }
        });
        
        // Add click event handlers
        fontOptions.forEach(option => {
          option.addEventListener('click', function() {
            const font = this.getAttribute('data-font');
            // Remove selected class from all options
            fontOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            // Apply the font
            document.documentElement.setAttribute('data-font', font);
            // Save to settings
            const settings = JSON.parse(localStorage.getItem('cottagosSettings') || '{}');
            settings.font = font;
            localStorage.setItem('cottagosSettings', JSON.stringify(settings));
          });
        });
      }
    }
  });
}

// --- Mobile Home Screen Drag & Drop Rearrangement ---
function initializeMobileIconDragAndDrop() {
  const mobileHome = document.querySelector('.mobile-home');
  if (!mobileHome) return;

  // Helper: get all icons (home + dock)
  function getAllIcons() {
    return [
      ...mobileHome.querySelectorAll('.mobile-app-icon'),
      ...mobileHome.querySelectorAll('.mobile-dock-icon')
    ];
  }

  // Only allow drag & drop in edit mode
  function isEditMode() {
    return mobileHome.classList.contains('edit-mode');
  }

  let dragging = null;
  let dragOverIcon = null;
  let startPage = null;
  let startIndex = null;
  let ghost = null;
  let iconsOrder = [];

  // Build initial order (per page, then dock)
  function buildOrder() {
    iconsOrder = [];
    mobileHome.querySelectorAll('.mobile-page').forEach(page => {
      const pageIcons = Array.from(page.querySelectorAll('.mobile-app-icon'));
      iconsOrder.push(...pageIcons);
    });
    iconsOrder.push(...mobileHome.querySelectorAll('.mobile-dock-icon'));
  }

  buildOrder();

  // Utility: swap two icons in DOM and in iconsOrder
  function swapIcons(iconA, iconB) {
    if (!iconA || !iconB || iconA === iconB) return;
    const parentA = iconA.parentNode;
    const parentB = iconB.parentNode;
    const nextA = iconA.nextSibling;
    const nextB = iconB.nextSibling;
    parentA.insertBefore(iconB, nextA);
    parentB.insertBefore(iconA, nextB);
    // Update order array
    const idxA = iconsOrder.indexOf(iconA);
    const idxB = iconsOrder.indexOf(iconB);
    if (idxA > -1 && idxB > -1) {
      [iconsOrder[idxA], iconsOrder[idxB]] = [iconsOrder[idxB], iconsOrder[idxA]];
    }
  }

  // Animate icon bounce
  function bounceIcon(icon) {
    icon.classList.add('bounce');
    setTimeout(() => icon.classList.remove('bounce'), 400);
  }

  // Drag start handler
  function onDragStart(e, icon) {
    if (!isEditMode()) return;
    e.preventDefault();
    dragging = icon;
    dragOverIcon = null;
    startPage = icon.closest('.mobile-page') || icon.closest('.mobile-dock');
    startIndex = Array.from(icon.parentNode.children).indexOf(icon);
    // Create ghost
    ghost = icon.cloneNode(true);
    ghost.style.opacity = '0.5';
    ghost.style.position = 'absolute';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.classList.add('drag-ghost');
    document.body.appendChild(ghost);
    moveGhost(e);
    icon.classList.add('dragging');
    document.body.style.userSelect = 'none';
  }

  // Move ghost icon to pointer
  function moveGhost(e) {
    if (!ghost) return;
    let x, y;
    if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    ghost.style.left = (x - 30) + 'px';
    ghost.style.top = (y - 30) + 'px';
  }

  // Drag over handler
  function onDragOver(e) {
    if (!dragging || !isEditMode()) return;
    moveGhost(e);
    const allIcons = getAllIcons();
    let found = false;
    for (const icon of allIcons) {
      if (icon === dragging) continue;
      const rect = icon.getBoundingClientRect();
      let x, y;
      if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      if (
        x >= rect.left && x <= rect.right &&
        y >= rect.top && y <= rect.bottom
      ) {
        if (dragOverIcon !== icon) {
          swapIcons(dragging, icon);
          bounceIcon(icon);
          dragOverIcon = icon;
        }
        found = true;
        break;
      }
    }
    if (!found) dragOverIcon = null;
  }

  // Drag end handler
  function onDragEnd(e) {
    if (!dragging) return;
    if (ghost) ghost.remove();
    dragging.classList.remove('dragging');
    dragging = null;
    dragOverIcon = null;
    document.body.style.userSelect = '';
    buildOrder();
  }

  // Attach listeners to all icons
  function attachListeners(icon) {
    // Mouse
    icon.addEventListener('mousedown', e => {
      if (!isEditMode()) return;
      onDragStart(e, icon);
      window.addEventListener('mousemove', onDragOver);
      window.addEventListener('mouseup', onDragEnd, { once: true });
    });
    // Touch
    icon.addEventListener('touchstart', e => {
      if (!isEditMode()) return;
      onDragStart(e, icon);
      window.addEventListener('touchmove', onDragOver, { passive: false });
      window.addEventListener('touchend', onDragEnd, { once: true });
    });
  }

  // Re-attach listeners on mode change or DOM update
  function refreshListeners() {
    getAllIcons().forEach(icon => {
      icon.onmousedown = icon.ontouchstart = null;
      attachListeners(icon);
    });
  }

  // Listen for edit mode changes
  const observer = new MutationObserver(() => {
    refreshListeners();
  });
  observer.observe(mobileHome, { attributes: true, attributeFilter: ['class'] });

  // Initial attach
  refreshListeners();
}

// --- End Mobile Drag & Drop ---

// --- Mobile Home Icon Removal with Cozy Confirmation ---
function initializeMobileIconRemove() {
  const mobileHome = document.querySelector('.mobile-home');
  if (!mobileHome) return;

  // Helper: show confirmation dialog
  function showRemoveConfirm(icon, onConfirm) {
    // Remove any existing dialog
    const oldDialog = document.getElementById('remove-icon-dialog');
    if (oldDialog) oldDialog.remove();
    // Create dialog
    const dialog = document.createElement('div');
    dialog.id = 'remove-icon-dialog';
    dialog.style.position = 'fixed';
    dialog.style.left = '0';
    dialog.style.top = '0';
    dialog.style.width = '100vw';
    dialog.style.height = '100vh';
    dialog.style.background = 'rgba(245,230,211,0.85)';
    dialog.style.display = 'flex';
    dialog.style.alignItems = 'center';
    dialog.style.justifyContent = 'center';
    dialog.style.zIndex = '99999';
    dialog.innerHTML = `
      <div style="background: #fff8f2; border: 3px solid #bfae80; border-radius: 18px; box-shadow: 0 6px 32px #bfae80; padding: 2em 1.5em; max-width: 90vw; text-align: center; font-family: 'Cormorant Garamond', serif;">
        <div style='font-size:2.2em; margin-bottom:0.5em;'>🍃</div>
        <div style='font-size:1.2em; margin-bottom:1em;'>Remove <span style='font-family: "Indie Flower", cursive;'>"${icon.querySelector('.mobile-app-label')?.textContent || icon.querySelector('span')?.textContent || 'this app'}"</span> from your home screen?</div>
        <div style='display:flex; gap:1.5em; justify-content:center; margin-top:1em;'>
          <button id='remove-icon-confirm' style='background:#c45c66; color:#fff; border:none; border-radius:12px; font-size:1em; padding:0.6em 1.4em; font-family:"Indie Flower",cursive; box-shadow:0 2px 8px #c45c66;'>Remove</button>
          <button id='remove-icon-cancel' style='background:#9caf88; color:#fff; border:none; border-radius:12px; font-size:1em; padding:0.6em 1.4em; font-family:"Indie Flower",cursive; box-shadow:0 2px 8px #9caf88;'>Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector('#remove-icon-confirm').onclick = () => {
      dialog.remove();
      onConfirm();
    };
    dialog.querySelector('#remove-icon-cancel').onclick = () => {
      dialog.remove();
    };
  }

  // Attach X button and handler to each icon in edit mode
  function updateRemoveButtons() {
    const allIcons = [
      ...mobileHome.querySelectorAll('.mobile-app-icon'),
      ...mobileHome.querySelectorAll('.mobile-dock-icon')
    ];
    allIcons.forEach(icon => {
      let xBtn = icon.querySelector('.icon-remove-btn');
      if (!xBtn) {
        xBtn = document.createElement('button');
        xBtn.className = 'icon-remove-btn';
        xBtn.type = 'button';
        xBtn.innerHTML = '✕';
        icon.appendChild(xBtn);
      }
      xBtn.style.display = isEditMode() ? 'flex' : 'none';
      xBtn.onclick = e => {
        e.stopPropagation();
        if (!isEditMode()) return;
        showRemoveConfirm(icon, () => {
          icon.remove();
        });
      };
    });
  }

  // Only show X in edit mode
  function isEditMode() {
    return mobileHome.classList.contains('edit-mode');
  }

  // Observe edit mode changes
  const observer = new MutationObserver(() => {
    updateRemoveButtons();
  });
  observer.observe(mobileHome, { attributes: true, attributeFilter: ['class'] });

  // Initial setup
  updateRemoveButtons();
}

// --- End Mobile Icon Remove ---

function attachMobileHomeAppHandler() {
  const mobileHome = document.querySelector('.mobile-home');
  const mobileModal = document.querySelector('.mobile-app-modal');
  if (mobileHome && mobileModal && !mobileHome._appHandlerAttached) {
    console.log('Attaching mobile home click listener...'); // DEBUG
    mobileHome.addEventListener('click', function(e) {
      console.log('Mobile home area clicked. Target:', e.target); // DEBUG
      if (mobileHome.classList.contains('edit-mode')) {
        console.log('In edit mode, ignoring click.'); // DEBUG
        return;
      }
      const btn = e.target.closest('.mobile-app-icon, .mobile-dock-icon');
      if (!btn) {
        console.log('Click was not on an app icon.'); // DEBUG
        return;
      }
      const appName = btn.getAttribute('data-app');
      if (!appName) {
        console.log('Icon has no data-app attribute.'); // DEBUG
        return;
      }
      console.log('Attempting to open app:', appName); // DEBUG
      mobileModal.innerHTML = '';
      mobileModal.classList.add('active');
      const template = document.getElementById(appName + '-template');
      if (template) {
        console.log(`Found template for ${appName}`); // DEBUG
        const modalContent = document.createElement('div');
        modalContent.className = 'mobile-app-modal-content';
        modalContent.appendChild(template.content.cloneNode(true));
        
        // Add back button to the modal content
        addMobileBackButton(modalContent);
        
        mobileModal.appendChild(modalContent);
        
        // Special case for Garden Planner
        if (appName === 'garden') {
          console.log('Initializing Garden Planner app...'); // DEBUG
          if (window.initGardenPlanner) {
            console.log('Found initGardenPlanner function'); // DEBUG
            const gameContainer = modalContent.querySelector('.garden-game');
            if (gameContainer) {
              console.log('Found garden-game container, initializing...'); // DEBUG
              try {
                window.initGardenPlanner(gameContainer);
                console.log('Garden Planner initialized successfully'); // DEBUG
              } catch (error) {
                console.error('Error initializing Garden Planner:', error); // DEBUG
              }
            } else {
              console.error('Could not find .garden-game container in the template'); // DEBUG
            }
          } else {
            console.error('initGardenPlanner function not found in window object'); // DEBUG
          }
        }
        // For other apps, use the standard pattern
        console.log(`Looking for init function for ${appName}`); // DEBUG
        const initFn = window['init' + appName.charAt(0).toUpperCase() + appName.slice(1)];
        if (typeof initFn === 'function') {
          const container = modalContent.querySelector('.' + appName + '-container') || modalContent;
          console.log(`Calling init function for ${appName}`); // DEBUG
          try {
            initFn(container);
            console.log(`${appName} initialized successfully`); // DEBUG
          } catch (error) {
            console.error(`Error initializing ${appName}:`, error); // DEBUG
          }
        } else {
          console.warn(`No init function found for ${appName}`); // DEBUG
        }
      } else {
        console.error('Template not found for:', appName); // DEBUG Error
        mobileModal.innerHTML = `<div class='mobile-app-modal-content'><p style='padding:2em;text-align:center;'>Error: Template for ${appName} not found.</p></div>`;
      }
    });
    mobileHome._appHandlerAttached = true;
    console.log('Mobile home click listener attached.'); // DEBUG
  } else {
    console.warn('Could not attach mobile home app handler:', {
      mobileHome: !!mobileHome,
      mobileModal: !!mobileModal,
      alreadyAttached: mobileHome && mobileHome._appHandlerAttached
    }); // DEBUG
  }
}

// Initialize Mobile Night Mode Toggle
function initializeMobileNightModeToggle() {
  const nightModeToggle = document.querySelector('.mobile-app-modal .setting-item .toggle-switch[data-setting="night-mode"]');
  if (!nightModeToggle) {
    // Add a mutation observer to detect when settings page is opened
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            // Check if the settings app was added to the DOM
            if (mutation.addedNodes[i].classList && 
                mutation.addedNodes[i].classList.contains('mobile-app-modal-content')) {
              // Try to find the night mode toggle
              const settingsToggle = document.querySelector('.mobile-app-modal .setting-item .toggle-switch[data-setting="night-mode"]');
              if (settingsToggle) {
                attachNightModeToggleHandler(settingsToggle);
                observer.disconnect();
              }
            }
          }
        }
      });
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    attachNightModeToggleHandler(nightModeToggle);
  }
}

// Attach handler to night mode toggle
function attachNightModeToggleHandler(toggle) {
  console.log('Attaching night mode handler to mobile toggle');
  
  // Set initial state based on body class
  const isNightMode = document.body.classList.contains('night-mode');
  if (isNightMode) {
    toggle.classList.add('active');
  } else {
    toggle.classList.remove('active');
  }
  
  // Add click handler
  toggle.addEventListener('click', function(e) {
    console.log('Night mode toggle clicked');
    
    // Get current state and explicitly toggle instead of using classList.toggle
    const isCurrentlyNight = document.body.classList.contains('night-mode');
    
    // Set to opposite state
    if (isCurrentlyNight) {
      document.body.classList.remove('night-mode');
      this.classList.remove('active');
      console.log('Night mode is now: false');
    } else {
      document.body.classList.add('night-mode');
      this.classList.add('active');
      console.log('Night mode is now: true');
    }
    
    // Save to localStorage (with the new toggled state)
    const settings = JSON.parse(localStorage.getItem('cottagosSettings') || '{}');
    settings.nightMode = !isCurrentlyNight;
    localStorage.setItem('cottagosSettings', JSON.stringify(settings));
    
    // Update icons for the theme change
    updateAppIconsForTheme();
    
    // Prevent event bubbling to avoid conflicts
    e.stopPropagation();
    e.preventDefault();
    
    // Log success
    console.log('Night mode setting saved:', !isCurrentlyNight);
    
    return false; // Cancel further propagation
  });
}

// Simple direct function to set up the night mode toggle
function setupMobileNightModeToggle() {
  console.log('Setting up night mode toggle in mobile settings');
  
  // Find night mode toggle directly
  const nightModeToggle = document.querySelector('.setting-item .toggle-switch[data-setting="night-mode"]');
  if (!nightModeToggle) {
    console.error('Night mode toggle not found');
    return;
  }
  
  // Clean up any existing handler
  if (nightModeToggle._handlerAttached) {
    return;
  }
  
  // Set initial toggle state based on body class
  if (document.body.classList.contains('night-mode')) {
    nightModeToggle.classList.add('active');
  } else {
    nightModeToggle.classList.remove('active');
  }
  
  // Add the click handler with debug
  nightModeToggle.addEventListener('click', function(e) {
    console.log('Night mode toggle clicked');
    
    // Get current state and explicitly toggle instead of using classList.toggle
    const isCurrentlyNight = document.body.classList.contains('night-mode');
    
    // Set to opposite state
    if (isCurrentlyNight) {
      document.body.classList.remove('night-mode');
      this.classList.remove('active');
      console.log('Night mode is now: false');
    } else {
      document.body.classList.add('night-mode');
      this.classList.add('active');
      console.log('Night mode is now: true');
    }
    
    // Save to localStorage (with the new toggled state)
    const settings = JSON.parse(localStorage.getItem('cottagosSettings') || '{}');
    settings.nightMode = !isCurrentlyNight;
    localStorage.setItem('cottagosSettings', JSON.stringify(settings));
    
    // Update icons for the theme change
    updateAppIconsForTheme();
    
    // Prevent event bubbling to avoid conflicts
    e.stopPropagation();
    e.preventDefault();
    
    // Log success
    console.log('Night mode setting saved:', !isCurrentlyNight);
    
    return false; // Cancel further propagation
  });
  
  // Mark the toggle as having a handler attached
  nightModeToggle._handlerAttached = true;
  console.log('Night mode toggle handler attached successfully');
}

// Initialize SYNEVA
function initSyneva(container) {
  const output = container.querySelector('.syneva-output');
  const input = container.querySelector('.syneva-input');
  const typingIndicator = container.querySelector('.typing-indicator');
  
  // Add back button using helper function
  addMobileBackButton(container);
  
  // Initialize input handler
  if (input && output && typingIndicator) {
    // Clear previous messages
    output.innerHTML = '';
    
    // Add welcome message
    const welcomeMessage = document.createElement('p');
    welcomeMessage.textContent = "Welcome to SYNEVA, your cottage companion. How may I assist you today?";
    output.appendChild(welcomeMessage);
    
    // Handle input submission
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        
        // Get user input
        const userMessage = input.value.trim();
        if (!userMessage) return;
        
        // Display user message
        const userMessageElement = document.createElement('p');
        userMessageElement.textContent = userMessage;
        output.appendChild(userMessageElement);
        
        // Clear input
        input.value = '';
        
        // Show typing indicator
        typingIndicator.style.display = 'block';
        
        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
        
        // Simulate response after a delay
        setTimeout(function() {
          // Hide typing indicator
          typingIndicator.style.display = 'none';
          
          // Generate response
          const response = generateSynevaResponse(userMessage);
          
          // Display response
          const responseElement = document.createElement('p');
          responseElement.textContent = response;
          output.appendChild(responseElement);
          
          // Scroll to bottom
          output.scrollTop = output.scrollHeight;
        }, 1500);
      }
    });
  }
}

// Generate a response from SYNEVA
function generateSynevaResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Basic response mapping
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello there! It's lovely to chat with you today. How is your cottage life?";
  }
  
  if (lowerMessage.includes('how are you')) {
    return "I'm as peaceful as a morning in the meadow, thank you for asking. How about you?";
  }
  
  if (lowerMessage.includes('weather')) {
    return "The weather outside is quite delightful. Perfect for tending to the garden or perhaps collecting wildflowers.";
  }
  
  if (lowerMessage.includes('recipe') || lowerMessage.includes('cook') || lowerMessage.includes('bake')) {
    return "I'd recommend trying a rustic lavender bread or perhaps some wild berry jam. The recipe book has many delightful options!";
  }
  
  if (lowerMessage.includes('garden') || lowerMessage.includes('flower') || lowerMessage.includes('plant')) {
    return "Your garden is flourishing beautifully! Remember that chamomile prefers morning sun, and mint needs to be watched or it will take over!";
  }
  
  if (lowerMessage.includes('mossbell') || lowerMessage.includes('pet')) {
    return "Your Mossbell pet seems quite content today. Have you spent time playing with them recently?";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
    return "I can help with many things around your digital cottage - from recipes and weather to caring for your Mossbell pet. What would you like assistance with?";
  }
  
  // Default responses
  const defaultResponses = [
    "The gentle pace of cottage life gives us time to appreciate the little things, doesn't it?",
    "Have you tried watching the butterflies in the meadow? They're particularly active today.",
    "I find that a cup of herbal tea makes any cottage day better. Perhaps chamomile or mint?",
    "The sounds of nature are so soothing. I particularly enjoy the chorus of birds at dawn.",
    "Your cottage has such wonderful energy. It's a perfect little sanctuary.",
    "I noticed some wildflowers blooming near the path. They would make a lovely centerpiece.",
    "Sometimes I like to imagine what stories these old cottage walls could tell if they could speak.",
    "Have you tried the stargazing feature? The night sky is particularly clear tonight."
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Add consistent back button to mobile apps
function addMobileBackButton(container) {
  // Check if back button already exists
  if (!container.querySelector('.mobile-app-back-btn')) {
    const backBtn = document.createElement('button');
    backBtn.className = 'mobile-app-back-btn';
    backBtn.innerHTML = '←';
    backBtn.title = 'Return to Home';
    backBtn.setAttribute('aria-label', 'Return to Home');
    
    // Add click event to return to home screen
    backBtn.addEventListener('click', function() {
      const mobileModal = document.querySelector('.mobile-app-modal');
      if (mobileModal) {
        mobileModal.classList.remove('active');
        mobileModal.innerHTML = '';
      }
    });
    
    // Insert at the beginning of the container
    container.insertAdjacentElement('afterbegin', backBtn);
  }
}
