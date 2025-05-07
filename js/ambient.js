// Ambient effects for Weather Widget and other animations
function initWeather(windowElement) {
  const weatherAnimation = windowElement.querySelector('#weather-animation');
  const weatherStatus = windowElement.querySelector('#weather-status');
  const weatherTemp = windowElement.querySelector('#weather-temp');
  
  // Weather types
  const weatherTypes = ['sunny', 'rain', 'snow'];
  let currentWeather = weatherTypes[0]; // Start with sunny
  
  // Set initial weather
  updateWeather();
  
  // Change weather every hour
  setInterval(updateWeather, 3600000); // 1 hour
  
  function updateWeather() {
    // Randomly select new weather
    const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    currentWeather = newWeather;
    
    // Clear previous weather
    weatherAnimation.innerHTML = '';
    weatherAnimation.className = 'weather-animation'; // Reset classes
    
    // Set new weather class
    weatherAnimation.classList.add(currentWeather);
    
    // Update status text
    weatherStatus.textContent = capitalizeFirstLetter(currentWeather);
    
    // Generate random temperature appropriate for the weather
    let temperature;
    switch (currentWeather) {
      case 'sunny':
        temperature = Math.floor(Math.random() * 20) + 65; // 65-85°F
        break;
      case 'rain':
        temperature = Math.floor(Math.random() * 15) + 50; // 50-65°F
        break;
      case 'snow':
        temperature = Math.floor(Math.random() * 20) + 20; // 20-40°F
        break;
    }
    
    weatherTemp.textContent = `${temperature}°`;
    
    // Create weather elements
    createWeatherElements(currentWeather);
  }
  
  function createWeatherElements(weather) {
    switch (weather) {
      case 'rain':
        createRaindrops();
        break;
      case 'snow':
        createSnowflakes();
        break;
      // Sunny doesn't need elements, it's a gradient
    }
  }
  
  function createRaindrops() {
    const dropCount = 20;
    
    for (let i = 0; i < dropCount; i++) {
      const raindrop = document.createElement('div');
      raindrop.classList.add('raindrop');
      
      // Random position and delay
      raindrop.style.left = `${Math.random() * 100}%`;
      raindrop.style.animationDelay = `${Math.random() * 1.5}s`;
      
      weatherAnimation.appendChild(raindrop);
    }
  }
  
  function createSnowflakes() {
    const flakeCount = 15;
    
    for (let i = 0; i < flakeCount; i++) {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      
      // Random position, size and delay
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.top = `${Math.random() * 100}%`;
      snowflake.style.width = `${3 + Math.random() * 4}px`;
      snowflake.style.height = snowflake.style.width;
      snowflake.style.animationDelay = `${Math.random() * 8}s`;
      snowflake.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 40}px`);
      
      weatherAnimation.appendChild(snowflake);
    }
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Idle mode detection and screen saver
(function() {
  let idleTime = 0;
  const idleInterval = 60000; // Check every minute
  const idleThreshold = 2; // 2 minutes
  
  // Idle timer increment
  const idleIncrement = setInterval(function() {
    idleTime++;
    
    if (idleTime >= idleThreshold) {
      // Enter idle mode / screen saver
      enterIdleMode();
    }
  }, idleInterval);
  
  // Reset idle timer on activity
  function resetIdleTime() {
    idleTime = 0;
    
    // If screen saver is active, exit it
    if (document.getElementById('screen-saver')) {
      exitIdleMode();
    }
  }
  
  // Monitor user activity
  document.addEventListener('mousemove', resetIdleTime);
  document.addEventListener('mousedown', resetIdleTime);
  document.addEventListener('keypress', resetIdleTime);
  document.addEventListener('touchstart', resetIdleTime);
  
  // Screen saver / idle mode
  function enterIdleMode() {
    // Create screen saver if it doesn't exist
    if (!document.getElementById('screen-saver')) {
      const screenSaver = document.createElement('div');
      screenSaver.id = 'screen-saver';
      screenSaver.classList.add('screen-saver');
      
      // Create fireflies
      createFireflies(screenSaver);
      
      document.body.appendChild(screenSaver);
      
      // Play lullaby music if available
      playLullaby();
      
      // Click to exit
      screenSaver.addEventListener('click', exitIdleMode);
    }
  }
  
  function exitIdleMode() {
    const screenSaver = document.getElementById('screen-saver');
    if (screenSaver) {
      screenSaver.remove();
      
      // Stop lullaby
      stopLullaby();
    }
    
    // Reset idle time
    resetIdleTime();
  }
  
  function createFireflies(container) {
    const fireflyCount = 15;
    
    for (let i = 0; i < fireflyCount; i++) {
      const firefly = document.createElement('div');
      firefly.classList.add('firefly');
      
      // Random size, position and animation delay
      const size = 3 + Math.random() * 4;
      firefly.style.width = `${size}px`;
      firefly.style.height = `${size}px`;
      firefly.style.left = `${Math.random() * 100}vw`;
      firefly.style.top = `${Math.random() * 100}vh`;
      firefly.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(firefly);
    }
    
    // Add a cottage silhouette
    const cottage = document.createElement('div');
    cottage.classList.add('cottage-silhouette');
    container.appendChild(cottage);
  }
  
  // Music functions
  function playLullaby() {
    // Simple placeholder - in real app would actually play audio
    console.log('Playing lullaby music');
    
    // Create actual audio if file is available
    const audio = document.createElement('audio');
    audio.id = 'lullaby-audio';
    audio.src = 'assets/sounds/lullaby.mp3';
    audio.loop = true;
    audio.volume = 0.3;
    
    try {
      audio.play();
    } catch (e) {
      console.log('Auto-play prevented by browser');
    }
  }
  
  function stopLullaby() {
    const audio = document.getElementById('lullaby-audio');
    if (audio) {
      audio.pause();
      audio.remove();
    }
  }
  
  // Add screen saver CSS
  const screenSaverStyles = document.createElement('style');
  screenSaverStyles.textContent = `
    .screen-saver {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 15, 0.85);
      z-index: 10000;
      animation: fadeIn 0.5s ease-in forwards;
    }
    
    .firefly {
      position: absolute;
      background-color: rgba(255, 255, 150, 0.8);
      border-radius: 50%;
      filter: blur(2px);
      box-shadow: 0 0 10px 2px rgba(255, 255, 150, 0.5);
      animation: fireflyGlow 3s infinite alternate ease-in-out;
    }
    
    .cottage-silhouette {
      position: absolute;
      bottom: 10vh;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 150px;
      background-image: url('assets/images/cottage-silhouette.svg');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center bottom;
      opacity: 0.7;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fireflyGlow {
      0%, 100% { opacity: 0.2; transform: translate(0, 0); }
      50% { opacity: 0.8; transform: translate(var(--dx, 20px), var(--dy, -15px)); }
    }
  `;
  document.head.appendChild(screenSaverStyles);
  
  // Set random motion variables for each firefly
  document.addEventListener('DOMContentLoaded', function() {
    setInterval(function() {
      const fireflies = document.querySelectorAll('.firefly');
      fireflies.forEach(firefly => {
        firefly.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
        firefly.style.setProperty('--dy', `${(Math.random() - 0.5) * 40}px`);
      });
    }, 3000);
  });
})();

// --- Ambient Sound Controls ---
window.cottageOS = window.cottageOS || {};
window.cottageOS.Ambient = {
  ambientAudio: null,
  isAmbientOn: false,
  volume: 70,
  ensureAudio() {
    if (!this.ambientAudio) {
      this.ambientAudio = document.getElementById('ambient-audio');
      if (!this.ambientAudio) {
        this.ambientAudio = document.createElement('audio');
        this.ambientAudio.id = 'ambient-audio';
        this.ambientAudio.src = 'assets/sounds/ambient.mp3'; // Replace with your ambient sound file
        this.ambientAudio.loop = true;
        this.ambientAudio.volume = this.volume / 100;
        document.body.appendChild(this.ambientAudio);
      }
    }
  },
  toggleAmbient(on) {
    this.ensureAudio();
    this.isAmbientOn = on;
    if (on) {
      this.ambientAudio.volume = this.volume / 100;
      this.ambientAudio.play().catch(()=>{});
    } else {
      this.ambientAudio.pause();
    }
  },
  setVolume(vol) {
    this.volume = vol;
    this.ensureAudio();
    this.ambientAudio.volume = this.volume / 100;
  }
};
