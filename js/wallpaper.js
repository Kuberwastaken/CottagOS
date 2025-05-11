/**
 * CottagOS - Wallpaper Module
 * Handles the dynamic wallpaper functionality using jsDelivr CDN for GIFs
 */

(function() {
  // Wallpaper GIF URLs from jsDelivr CDN
  const WALLPAPERS = {
    none: null,
    'cherry-blossom-day': 'https://cdn.jsdelivr.net/gh/Kuberwastaken/CottagOS@main/assets/wallpapers/cherry-blossom-day.gif',
    'cherry-blossom-night': 'https://cdn.jsdelivr.net/gh/Kuberwastaken/CottagOS@main/assets/wallpapers/cherry-blossom-night.gif'
  };

  // References to DOM elements
  let desktop = document.getElementById('desktop');
  let currentWallpaper = null;
  let wallpaperElement = null;

  // Initialize the module
  function init() {
    // Setup event listeners for wallpaper options
    const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
    wallpaperOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove 'selected' class from all options
        wallpaperOptions.forEach(opt => opt.classList.remove('selected'));
        // Add 'selected' class to clicked option
        option.classList.add('selected');
        
        // Set the wallpaper
        const wallpaperType = option.getAttribute('data-wallpaper');
        setWallpaper(wallpaperType);
        
        // Save to local storage
        localStorage.setItem('cottageos-wallpaper', wallpaperType);
      });
    });

    // Load saved wallpaper from local storage
    const savedWallpaper = localStorage.getItem('cottageos-wallpaper');
    if (savedWallpaper && WALLPAPERS[savedWallpaper]) {
      // Find and select the saved wallpaper option
      const option = document.querySelector(`.wallpaper-option[data-wallpaper="${savedWallpaper}"]`);
      if (option) {
        wallpaperOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        setWallpaper(savedWallpaper);
      }
    }
  }

  // Set wallpaper function
  function setWallpaper(type) {
    // Remove current wallpaper if exists
    if (wallpaperElement && wallpaperElement.parentNode) {
      wallpaperElement.parentNode.removeChild(wallpaperElement);
      wallpaperElement = null;
    }

    // If type is 'none' or invalid, don't add a new wallpaper
    if (type === 'none' || !WALLPAPERS[type]) {
      currentWallpaper = 'none';
      return;
    }

    // Create wallpaper element
    wallpaperElement = document.createElement('div');
    wallpaperElement.className = 'desktop-wallpaper';
    wallpaperElement.style.backgroundImage = `url('${WALLPAPERS[type]}')`;
    
    // Insert at the beginning of desktop (behind other elements)
    desktop.insertBefore(wallpaperElement, desktop.firstChild);
    
    currentWallpaper = type;
  }

  // Add CSS for wallpaper styling
  function addWallpaperStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .desktop-wallpaper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 1;
        pointer-events: none;
        opacity: 0.5; /* Adjust opacity to ensure desktop icons remain visible */
      }
      
      /* Improve visibility of desktop content over wallpaper */
      .desktop-icon {
        position: relative;
        z-index: 2;
      }
      
      .dandelion-seeds, .butterflies {
        position: relative;
        z-index: 2;
      }
      
      /* Wallpaper selector styles */
      .wallpaper-selector {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
      }
      
      .wallpaper-option {
        padding: 4px 8px;
        border-radius: 12px;
        background-color: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }
      
      .wallpaper-option.selected {
        background-color: rgba(156, 175, 136, 0.5);
        border: 1px solid #9CAF88;
      }
      
      .wallpaper-option:hover {
        background-color: rgba(156, 175, 136, 0.3);
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Add the CSS styles
    addWallpaperStyles();
    
    // Initialize after a small delay to ensure Settings window has been created
    setTimeout(init, 500);
  });

  // Initialize when settings window is opened
  document.addEventListener('windowOpened', (event) => {
    if (event.detail.app === 'settings') {
      init();
    }
  });

  // Public API
  window.CottageOSWallpaper = {
    setWallpaper
  };
})(); 