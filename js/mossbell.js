// Mossbell Pet Implementation (Adapted from Tamagotchi)
function initMossbell(windowElement) {
  // Add font link if not already in document
  if (!document.querySelector('link[href*="VCR-Mono"]')) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.type = 'text/css';
    fontLink.href = 'assets/fonts/VCR-Mono/stylesheet.css';
    document.head.appendChild(fontLink);
  }

  // Get elements
  const clock = windowElement.querySelector('#moss-clock');
  const play = windowElement.querySelector('#play');
  const playText = windowElement.querySelector('#play-text');
  const feed = windowElement.querySelector('#feed');
  const feedText = windowElement.querySelector('#feed-text');
  const sleep = windowElement.querySelector('#sleep');
  const happy = windowElement.querySelector('#happy');
  const tummy = windowElement.querySelector('#tummy');
  const energy = windowElement.querySelector('#energy');
  const petContainer = windowElement.querySelector('.pet-container');
  const pet = windowElement.querySelector('.pet');
  const buttons = windowElement.querySelectorAll('button');

  // Pet state
  let petObj = {
    happy: 100,
    tummy: 100,
    energy: 100
  };

  // Sleep state
  let sleeping = false;
  
  // Load state from localStorage if available
  try {
    const savedState = localStorage.getItem('mossbellPet');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      petObj = parsed;
    }
  } catch (e) {
    console.log('Error loading Mossbell state:', e);
  }

  // Update the clock display
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = now.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    clock.textContent = hours + ':' + minutes;
  }
  updateClock();
  setInterval(updateClock, 60000);

  // Update stats display
  function updateStats() {
    happy.textContent = petObj.happy;
    tummy.textContent = petObj.tummy;
    energy.textContent = petObj.energy;
    
    // Save state to localStorage
    try {
      localStorage.setItem('mossbellPet', JSON.stringify(petObj));
    } catch (e) {
      console.log('Error saving Mossbell state:', e);
    }
  }
  updateStats();

  // Helper to set the correct GIF for the pet state
  function setPetGif(state) {
    switch (state) {
      case 'playing':
        pet.style.backgroundImage = "url('tamagotchi/graphics/dancing.gif')";
        break;
      case 'eating':
        pet.style.backgroundImage = "url('tamagotchi/graphics/eating.gif')";
        break;
      case 'sleeping':
        pet.style.backgroundImage = "url('tamagotchi/graphics/sleeping.gif')";
        break;
      default:
        pet.style.backgroundImage = "url('tamagotchi/graphics/pacing.gif')";
    }
  }

  // Initial state
  setPetGif('pacing');

  // Play button click
  play.addEventListener('click', function() {
    if (sleeping) return;
    
    if (petObj.energy > 0) {
      petContainer.classList.remove('pacing');
      petContainer.classList.add('center-pet');
      pet.classList.remove('pacing', 'sleeping', 'eating');
      pet.classList.add('playing');
      setPetGif('playing');
      
      for (const button of buttons) {
        button.classList.add('disable-buttons');
      }
      
      setTimeout(() => {
        for (const button of buttons) {
          button.classList.remove('disable-buttons');
        }
        pet.classList.remove('playing');
        petContainer.classList.remove('center-pet');
        petContainer.classList.add('pacing');
        pet.classList.add('pacing');
        setPetGif('pacing');
        
        petObj.happy = Math.min(petObj.happy + 15, 100);
        petObj.energy = Math.max(petObj.energy - 10, 0);
        petObj.tummy = Math.max(petObj.tummy - 5, 0);
        updateStats();
      }, 3000);
    } else {
      playText.textContent = 'TIRED';
      setTimeout(() => {
        playText.textContent = 'PLAY';
      }, 1500);
    }
  });

  // Feed button click
  feed.addEventListener('click', function() {
    if (sleeping) return;
    
    if (petObj.tummy < 100) {
      petContainer.classList.remove('pacing');
      petContainer.classList.add('center-pet');
      pet.classList.remove('pacing', 'playing', 'sleeping');
      pet.classList.add('eating');
      setPetGif('eating');
      
      for (const button of buttons) {
        button.classList.add('disable-buttons');
      }
      
      setTimeout(() => {
        for (const button of buttons) {
          button.classList.remove('disable-buttons');
        }
        pet.classList.remove('eating');
        petContainer.classList.remove('center-pet');
        petContainer.classList.add('pacing');
        pet.classList.add('pacing');
        setPetGif('pacing');
        
        petObj.tummy = Math.min(petObj.tummy + 15, 100);
        petObj.energy = Math.max(petObj.energy - 5, 0);
        updateStats();
      }, 3000);
    } else {
      feedText.textContent = 'FULL';
      setTimeout(() => {
        feedText.textContent = 'FEED';
      }, 1500);
    }
  });

  // Sleep button click
  sleep.addEventListener('click', function() {
    if (!sleeping) {
      sleeping = true;
      petContainer.classList.remove('pacing');
      petContainer.classList.add('center-pet');
      pet.classList.remove('pacing', 'playing', 'eating');
      pet.classList.add('sleeping');
      setPetGif('sleeping');
      windowElement.querySelector('.screen').style.background = 'linear-gradient(to bottom, #0a0a31, #0f0f4b)';

      // Recover energy while sleeping
      const recoveryInterval = setInterval(() => {
        if (!sleeping) {
          clearInterval(recoveryInterval);
          return;
        }

        petObj.energy = Math.min(petObj.energy + 10, 100);
        petObj.tummy = Math.max(petObj.tummy - 2, 0);
        updateStats();

        if (petObj.energy >= 100) {
          clearInterval(recoveryInterval);
        }
      }, 3000);
    } else {
      sleeping = false;
      windowElement.querySelector('.screen').style.background = '#cfe4f1';
      petContainer.classList.remove('center-pet');
      petContainer.classList.add('pacing');
      pet.classList.remove('sleeping');
      pet.classList.add('pacing');
      setPetGif('pacing');
    }
  });

  // Background processes - decrease stats over time
  const statsInterval = setInterval(() => {
    if (!sleeping) {
      petObj.happy = Math.max(petObj.happy - 5, 0);
      petObj.tummy = Math.max(petObj.tummy - 3, 0);
      petObj.energy = Math.max(petObj.energy - 2, 0);
      updateStats();
    }
  }, 30000); // Every 30 seconds

  // Cleanup interval when window is closed
  windowElement.addEventListener('DOMNodeRemoved', () => {
    clearInterval(statsInterval);
  });
  
  // Auto save every minute
  setInterval(() => {
    try {
      localStorage.setItem('mossbellPet', JSON.stringify(petObj));
    } catch (e) {
      console.log('Error auto-saving Mossbell state:', e);
    }
  }, 60000);
}
