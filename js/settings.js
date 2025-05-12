// Settings Cottage for CottagOS
function initializeSettings(windowNode) {
  // Find settings elements
  const settingsContainer = windowNode.querySelector('.settings-container');
  if (!settingsContainer) {
    console.error('Settings container not found!');
    return;
  }
  
  // Add sound settings section if it doesn't exist yet
  if (!windowNode.querySelector('.settings-group-sound')) {
    const soundSettings = document.createElement('div');
    soundSettings.classList.add('settings-group', 'settings-group-sound');
    soundSettings.innerHTML = `
      <div class="settings-group-title">Sound</div>
      <div class="setting-item">
        <div class="setting-label">Sound Effects</div>
        <div class="setting-control">
          <div class="toggle-switch" data-setting="sound-effects"></div>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-label">Sound Volume</div>
        <div class="setting-control">
          <div class="slider-control" id="sfx-volume-slider">
            <div class="slider-track">
              <div class="slider-handle" style="left: 70%;"></div>
            </div>
            <div class="slider-values">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-label">Background Music</div>
        <div class="setting-control">
          <div class="toggle-switch" data-setting="background-music"></div>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-label">Music Volume</div>
        <div class="setting-control">
          <div class="slider-control" id="bgm-volume-slider">
            <div class="slider-track">
              <div class="slider-handle" style="left: 40%;"></div>
            </div>
            <div class="slider-values">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add settings group after the Interface group
    const interfaceGroup = windowNode.querySelector('.settings-group:nth-child(2)');
    if (interfaceGroup) {
      interfaceGroup.after(soundSettings);
    } else {
      settingsContainer.appendChild(soundSettings);
    }
  }
  
  // Initialize settings from current state
  initializeSettingsState(windowNode);
  
  // Add event listeners to all setting controls
  addSettingsEventListeners(windowNode);
}

function initializeSettingsState(windowNode) {
  // Only initialize if soundManager exists
  if (!window.soundManager) return;
  
  // Set sound effects toggle state
  const sfxToggle = windowNode.querySelector('[data-setting="sound-effects"]');
  if (sfxToggle) {
    sfxToggle.classList.toggle('active', window.soundManager.soundsEnabled);
  }
  
  // Set background music toggle state
  const bgmToggle = windowNode.querySelector('[data-setting="background-music"]');
  if (bgmToggle) {
    bgmToggle.classList.toggle('active', window.soundManager.bgmEnabled);
  }
  
  // Set SFX volume slider position
  const sfxSlider = windowNode.querySelector('#sfx-volume-slider .slider-handle');
  if (sfxSlider) {
    sfxSlider.style.left = `${window.soundManager.sfxVolume * 100}%`;
  }
  
  // Set BGM volume slider position
  const bgmSlider = windowNode.querySelector('#bgm-volume-slider .slider-handle');
  if (bgmSlider) {
    bgmSlider.style.left = `${window.soundManager.bgmVolume * 100}%`;
  }
}

function addSettingsEventListeners(windowNode) {
  // Sound effects toggle
  const sfxToggle = windowNode.querySelector('[data-setting="sound-effects"]');
  if (sfxToggle && window.soundManager) {
    sfxToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      window.soundManager.toggleSounds(this.classList.contains('active'));
    });
  }
  
  // Background music toggle
  const bgmToggle = windowNode.querySelector('[data-setting="background-music"]');
  if (bgmToggle && window.soundManager) {
    bgmToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      window.soundManager.toggleBGM(this.classList.contains('active'));
    });
  }
  
  // SFX volume slider
  initializeVolumeSlider(
    windowNode.querySelector('#sfx-volume-slider'),
    (value) => {
      if (window.soundManager) {
        window.soundManager.setVolume(value);
        // Play sample sound to demonstrate volume
        window.soundManager.play('button-click');
      }
    }
  );
  
  // BGM volume slider
  initializeVolumeSlider(
    windowNode.querySelector('#bgm-volume-slider'),
    (value) => {
      if (window.soundManager) {
        window.soundManager.setBGMVolume(value);
      }
    }
  );
}

function initializeVolumeSlider(sliderElement, onChange) {
  if (!sliderElement) return;
  
  const handle = sliderElement.querySelector('.slider-handle');
  const track = sliderElement.querySelector('.slider-track');
  if (!handle || !track) return;
  
  let isDragging = false;
  
  // Handle drag start
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });
  
  // Handle drag
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const trackRect = track.getBoundingClientRect();
    let newPosition = (e.clientX - trackRect.left) / trackRect.width;
    newPosition = Math.max(0, Math.min(1, newPosition)); // Clamp to 0-1
    
    handle.style.left = `${newPosition * 100}%`;
    onChange(newPosition);
  });
  
  // Handle drag end
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Handle track click
  track.addEventListener('click', (e) => {
    const trackRect = track.getBoundingClientRect();
    let newPosition = (e.clientX - trackRect.left) / trackRect.width;
    newPosition = Math.max(0, Math.min(1, newPosition)); // Clamp to 0-1
    
    handle.style.left = `${newPosition * 100}%`;
    onChange(newPosition);
  });
}

// Add to window object for global access
window.cottageOS = window.cottageOS || {};
window.cottageOS.Settings = {
  initializeSettings
}; 