
// Mossbell Tamagotchi Pet Implementation (Duck Version)
function initMossbell(windowElement) {
  const mossbellPet = windowElement.querySelector('.mossbell-pet');
  const duckBody = windowElement.querySelector('.duck-body');
  const duckHead = windowElement.querySelector('.duck-head');
  const duckWing = windowElement.querySelector('.duck-wing');
  const hungerMeter = windowElement.querySelector('.hunger-meter');
  const happinessMeter = windowElement.querySelector('.happiness-meter');
  const energyMeter = windowElement.querySelector('.energy-meter');
  const feedButton = windowElement.querySelector('.feed-button');
  const playButton = windowElement.querySelector('.play-button');
  const patButton = windowElement.querySelector('.pat-button');
  const sleepButton = windowElement.querySelector('.sleep-button');
  const foodOptions = windowElement.querySelector('.food-options');
  const playOptions = windowElement.querySelector('.play-options');
  const moodIndicator = windowElement.querySelector('.mood-indicator');
  
  // Pet state
  const petState = {
    hunger: 3, // 0-3, 3 is full
    happiness: 3, // 0-3, 3 is max happy
    energy: 3, // 0-3, 3 is max energy
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastPatted: Date.now(),
    mood: 'content', // content, hungry, sleepy, excited, swimming
    sleeping: false,
    swimming: false
  };
  
  // Update visual hunger meter
  function updateHungerMeter() {
    const acorns = hungerMeter.querySelectorAll('.acorn');
    
    acorns.forEach((acorn, index) => {
      if (index < petState.hunger) {
        acorn.style.opacity = '1';
      } else {
        acorn.style.opacity = '0.3';
      }
    });
  }
  
  // Update visual happiness meter
  function updateHappinessMeter() {
    const flowers = happinessMeter.querySelectorAll('.flower');
    
    flowers.forEach((flower, index) => {
      if (index < petState.happiness) {
        flower.style.opacity = '1';
      } else {
        flower.style.opacity = '0.3';
      }
    });
  }
  
  // Update visual energy meter
  function updateEnergyMeter() {
    const sunbeams = energyMeter.querySelectorAll('.sunbeam');
    
    sunbeams.forEach((sunbeam, index) => {
      if (index < petState.energy) {
        sunbeam.style.opacity = '1';
      } else {
        sunbeam.style.opacity = '0.3';
      }
    });
  }
  
  // Update mood indicator
  function updateMoodIndicator() {
    const moodText = moodIndicator.querySelector('span');
    if (moodText) {
      moodText.textContent = petState.mood.charAt(0).toUpperCase() + petState.mood.slice(1);
    }
    
    // Update duck appearance based on mood
    mossbellPet.className = 'mossbell-pet';
    
    if (petState.sleeping) {
      mossbellPet.classList.add('duck-sleeping');
      petState.mood = 'sleeping';
    } else if (petState.swimming) {
      mossbellPet.classList.add('duck-swimming');
      petState.mood = 'swimming';
    } else if (petState.hunger <= 1) {
      mossbellPet.classList.add('duck-hungry');
      petState.mood = 'hungry';
    } else if (petState.happiness >= 3) {
      mossbellPet.classList.add('duck-excited');
      petState.mood = 'excited';
    } else if (petState.energy <= 1) {
      mossbellPet.classList.add('duck-sleepy');
      petState.mood = 'sleepy';
    } else {
      mossbellPet.classList.add('duck-content');
      petState.mood = 'content';
    }
    
    if (moodText) {
      moodText.textContent = petState.mood.charAt(0).toUpperCase() + petState.mood.slice(1);
    }
  }
  
  // Handle feeding the pet
  feedButton.addEventListener('click', function() {
    if (petState.sleeping) {
      return; // Can't feed while sleeping
    }
    
    // Toggle food options visibility
    foodOptions.classList.toggle('visible');
    playOptions.classList.remove('visible');
  });
  
  // Food option handlers
  const foodOptionElements = windowElement.querySelectorAll('.food-option');
  foodOptionElements.forEach(option => {
    option.addEventListener('click', function() {
      const foodType = this.classList[1]; // bread, berries, corn
      
      if (petState.hunger < 3) {
        // Create food animation
        createFood(foodType);
        
        // Increment hunger after eating animation finishes
        setTimeout(() => {
          petState.hunger = Math.min(petState.hunger + 1, 3);
          petState.lastFed = Date.now();
          petState.energy = Math.max(petState.energy - 0.5, 0); // Eating makes tired
          
          updateHungerMeter();
          updateEnergyMeter();
          updateMoodIndicator();
          
          // Hide food options after selection
          foodOptions.classList.remove('visible');
        }, 2000);
      } else {
        // Duck is full, just hide options
        foodOptions.classList.remove('visible');
      }
    });
  });
  
  // Handle playing with the pet
  playButton.addEventListener('click', function() {
    if (petState.sleeping) {
      return; // Can't play while sleeping
    }
    
    // Toggle play options visibility
    playOptions.classList.toggle('visible');
    foodOptions.classList.remove('visible');
  });
  
  // Play option handlers
  const playOptionElements = windowElement.querySelectorAll('.play-option');
  playOptionElements.forEach(option => {
    option.addEventListener('click', function() {
      const playType = this.classList[1]; // ball, bubbles, music
      
      if (petState.energy > 0) {
        // Create play animation
        createToy(playType);
        
        // Update happiness after play animation finishes
        setTimeout(() => {
          petState.happiness = 3; // Max happiness from playing
          petState.lastPlayed = Date.now();
          petState.energy = Math.max(petState.energy - 1, 0); // Playing makes tired
          petState.hunger = Math.max(petState.hunger - 0.5, 0); // Playing makes hungry
          
          updateHappinessMeter();
          updateEnergyMeter();
          updateHungerMeter();
          updateMoodIndicator();
          
          // Hide play options after selection
          playOptions.classList.remove('visible');
        }, 3000);
      } else {
        // Duck is too tired, just hide options
        playOptions.classList.remove('visible');
      }
    });
  });
  
  // Handle patting the pet
  patButton.addEventListener('click', function() {
    if (petState.sleeping) {
      return; // Can't pat while sleeping
    }
    
    // Animate patting effect
    const patEffect = document.createElement('div');
    patEffect.className = 'pat-effect';
    patEffect.innerHTML = '💖';
    patEffect.style.position = 'absolute';
    patEffect.style.top = '20px';
    patEffect.style.left = '50%';
    patEffect.style.transform = 'translateX(-50%)';
    patEffect.style.fontSize = '24px';
    patEffect.style.opacity = '0';
    patEffect.style.transition = 'all 0.5s ease';
    
    mossbellPet.appendChild(patEffect);
    
    setTimeout(() => {
      patEffect.style.top = '0px';
      patEffect.style.opacity = '1';
      
      setTimeout(() => {
        patEffect.style.opacity = '0';
        setTimeout(() => {
          patEffect.remove();
        }, 500);
      }, 1000);
    }, 100);
    
    // Increase happiness from patting
    petState.happiness = Math.min(petState.happiness + 0.5, 3);
    petState.lastPatted = Date.now();
    
    updateHappinessMeter();
    updateMoodIndicator();
  });
  
  // Handle sleep toggle
  sleepButton.addEventListener('click', function() {
    petState.sleeping = !petState.sleeping;
    
    if (petState.sleeping) {
      this.textContent = 'Wake Up';
      petState.swimming = false; // Can't swim while sleeping
      
      // Recover energy while sleeping
      const energyInterval = setInterval(() => {
        if (!petState.sleeping) {
          clearInterval(energyInterval);
          return;
        }
        
        petState.energy = Math.min(petState.energy + 0.5, 3);
        updateEnergyMeter();
        updateMoodIndicator();
        
        if (petState.energy >= 3) {
          // Automatically wake up when fully rested
          petState.sleeping = false;
          sleepButton.textContent = 'Sleep';
          updateMoodIndicator();
          clearInterval(energyInterval);
        }
      }, 3000);
    } else {
      this.textContent = 'Sleep';
    }
    
    updateMoodIndicator();
  });
  
  // Toggle swimming mode when clicked on the pond
  const pond = windowElement.querySelector('.pond');
  if (pond) {
    pond.addEventListener('click', function() {
      if (petState.sleeping) {
        return; // Can't swim while sleeping
      }
      
      petState.swimming = !petState.swimming;
      
      if (petState.swimming) {
        // Move duck to the pond
        mossbellPet.style.transition = 'all 0.5s ease';
        mossbellPet.style.transform = 'translate(0, 30px)';
        
        // Swimming makes the duck happy but uses energy
        petState.happiness = Math.min(petState.happiness + 1, 3);
        petState.energy = Math.max(petState.energy - 0.5, 0);
        
        updateHappinessMeter();
        updateEnergyMeter();
      } else {
        // Move duck out of the pond
        mossbellPet.style.transform = 'translate(0, 0)';
      }
      
      updateMoodIndicator();
    });
  }
  
  // Create food animation when feeding
  function createFood(foodType) {
    const food = document.createElement('div');
    food.className = 'duck-food';
    food.classList.add('visible');
    
    // Set food appearance based on type
    switch (foodType) {
      case 'bread':
        food.innerHTML = '🍞';
        break;
      case 'berries':
        food.innerHTML = '🫐';
        break;
      case 'corn':
        food.innerHTML = '🌽';
        break;
      default:
        food.innerHTML = '🍞';
    }
    
    food.style.position = 'absolute';
    food.style.bottom = '60px';
    food.style.left = '50%';
    food.style.transform = 'translateX(-50%)';
    food.style.fontSize = '24px';
    food.style.zIndex = '10';
    
    mossbellPet.appendChild(food);
    
    // Animate duck eating the food
    setTimeout(() => {
      duckHead.style.transform = 'rotate(20deg) translate(5px, 10px)';
      
      setTimeout(() => {
        // Move food closer to duck beak
        food.style.bottom = '40px';
        food.style.left = '70%';
        food.style.transform = 'translateX(-50%) scale(0.8)';
        
        setTimeout(() => {
          // Hide food (eaten)
          food.style.opacity = '0';
          food.style.transform = 'translateX(-50%) scale(0.5)';
          
          setTimeout(() => {
            // Return duck head to normal position
            duckHead.style.transform = '';
            food.remove();
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }
  
  // Create toy animation when playing
  function createToy(toyType) {
    const toy = document.createElement('div');
    toy.className = 'duck-toy';
    toy.classList.add('visible');
    
    // Set toy appearance based on type
    switch (toyType) {
      case 'ball':
        toy.innerHTML = '🏐';
        break;
      case 'bubbles':
        toy.innerHTML = '🫧';
        break;
      case 'music':
        toy.innerHTML = '🎵';
        break;
      default:
        toy.innerHTML = '🏐';
    }
    
    toy.style.position = 'absolute';
    toy.style.top = '20px';
    toy.style.right = '20px';
    toy.style.fontSize = '24px';
    toy.style.zIndex = '10';
    
    mossbellPet.appendChild(toy);
    
    // Different animations based on toy type
    if (toyType === 'ball') {
      // Ball bouncing animation
      toy.style.transition = 'all 0.5s ease-in-out';
      
      setTimeout(() => {
        toy.style.top = '50px';
        toy.style.right = '80px';
        
        setTimeout(() => {
          // Duck moves to catch the ball
          duckBody.style.transform = 'translateX(20px)';
          duckHead.style.transform = 'rotate(15deg)';
          duckWing.style.transform = 'rotate(20deg)';
          
          setTimeout(() => {
            toy.style.top = '70px';
            toy.style.right = '40px';
            
            setTimeout(() => {
              // Ball bounces again
              toy.style.top = '40px';
              toy.style.right = '20px';
              
              setTimeout(() => {
                // Duck returns to normal position
                duckBody.style.transform = '';
                duckHead.style.transform = '';
                duckWing.style.transform = '';
                
                // Ball disappears
                toy.style.opacity = '0';
                
                setTimeout(() => {
                  toy.remove();
                }, 500);
              }, 500);
            }, 500);
          }, 500);
        }, 500);
      }, 100);
    } else if (toyType === 'bubbles') {
      // Bubbles floating animation
      const bubblesCount = 5;
      
      // Remove the initial bubble
      toy.remove();
      
      // Create multiple bubbles
      for (let i = 0; i < bubblesCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'duck-toy bubble visible';
        bubble.innerHTML = '🫧';
        bubble.style.position = 'absolute';
        bubble.style.top = `${70 + Math.random() * 30}px`;
        bubble.style.left = `${20 + i * 30 + Math.random() * 10}px`;
        bubble.style.fontSize = `${16 + Math.random() * 12}px`;
        bubble.style.zIndex = '10';
        bubble.style.transition = 'all 2s ease-out';
        
        mossbellPet.appendChild(bubble);
        
        // Animate bubbles floating up
        setTimeout(() => {
          bubble.style.top = `${20 + Math.random() * 20}px`;
          bubble.style.left = `${bubble.offsetLeft + (Math.random() * 40 - 20)}px`;
          
          // Duck follows bubbles movement
          duckHead.style.transform = 'rotate(10deg) translateY(-5px)';
          duckWing.style.transform = 'rotate(15deg)';
          
          setTimeout(() => {
            bubble.style.opacity = '0';
            
            setTimeout(() => {
              bubble.remove();
              
              // If this is the last bubble, reset duck position
              if (i === bubblesCount - 1) {
                duckHead.style.transform = '';
                duckWing.style.transform = '';
              }
            }, 500);
          }, 1500);
        }, 100 + i * 200);
      }
    } else if (toyType === 'music') {
      // Music notes animation
      const notesCount = 4;
      const noteSymbols = ['🎵', '🎶', '♪', '♫'];
      
      // Remove the initial note
      toy.remove();
      
      // Create multiple music notes
      for (let i = 0; i < notesCount; i++) {
        const note = document.createElement('div');
        note.className = 'duck-toy music visible';
        note.innerHTML = noteSymbols[i % noteSymbols.length];
        note.style.position = 'absolute';
        note.style.top = '40px';
        note.style.left = '40px';
        note.style.fontSize = '20px';
        note.style.zIndex = '10';
        note.style.transition = 'all 1.5s ease-out';
        note.style.opacity = '0';
        
        mossbellPet.appendChild(note);
        
        // Animate notes appearing and floating away
        setTimeout(() => {
          note.style.opacity = '1';
          
          setTimeout(() => {
            note.style.top = '10px';
            note.style.left = `${60 + i * 20}px`;
            
            // Duck dances to the music
            duckBody.style.transform = i % 2 === 0 ? 'translateY(-5px)' : 'translateY(0)';
            duckHead.style.transform = i % 2 === 0 ? 'rotate(5deg)' : 'rotate(-5deg)';
            duckWing.style.transform = i % 2 === 0 ? 'rotate(10deg)' : 'rotate(-10deg)';
            
            setTimeout(() => {
              note.style.opacity = '0';
              
              setTimeout(() => {
                note.remove();
                
                // If this is the last note, reset duck position
                if (i === notesCount - 1) {
                  duckBody.style.transform = '';
                  duckHead.style.transform = '';
                  duckWing.style.transform = '';
                }
              }, 500);
            }, 1000);
          }, 300);
        }, i * 400);
      }
    }
  }
  
  // Time-based state changes
  function updatePetState() {
    const now = Date.now();
    
    // Skip updates if sleeping
    if (!petState.sleeping) {
      // Decrease hunger over time
      if (now - petState.lastFed > 60000) { // 1 minute
        petState.lastFed = now;
        if (petState.hunger > 0) {
          petState.hunger--;
          updateHungerMeter();
        }
      }
      
      // Decrease happiness over time
      if (now - petState.lastPlayed > 120000 && now - petState.lastPatted > 60000) { // 2 minutes since play, 1 minute since pat
        petState.lastPlayed = now;
        if (petState.happiness > 0) {
          petState.happiness--;
          updateHappinessMeter();
        }
      }
      
      // Decrease energy over time when active
      if (now - petState.lastFed > 180000) { // 3 minutes
        if (petState.energy > 0) {
          petState.energy--;
          updateEnergyMeter();
        }
      }
      
      // Automatically start swimming sometimes if near the pond
      if (Math.random() < 0.1 && !petState.swimming && petState.energy > 1) {
        petState.swimming = true;
        mossbellPet.style.transform = 'translate(0, 30px)';
        
        // Stop swimming after a while
        setTimeout(() => {
          petState.swimming = false;
          mossbellPet.style.transform = 'translate(0, 0)';
          updateMoodIndicator();
        }, 10000 + Math.random() * 10000); // Swim for 10-20 seconds
      }
    } else {
      // Recover energy while sleeping
      if (petState.energy < 3 && now - petState.lastFed > 20000) { // 20 seconds
        petState.energy = Math.min(petState.energy + 0.5, 3);
        updateEnergyMeter();
      }
    }
    
    // Set sleeping state based on time of day
    const hour = new Date().getHours();
    const shouldSleep = hour >= 22 || hour < 6;
    
    if (shouldSleep !== petState.sleeping && shouldSleep) {
      petState.sleeping = shouldSleep;
      if (sleepButton) {
        sleepButton.textContent = petState.sleeping ? 'Wake Up' : 'Sleep';
      }
    }
    
    // Update mood based on current state
    updateMoodIndicator();
  }
  
  // Initialize UI
  updateHungerMeter();
  updateHappinessMeter();
  updateEnergyMeter();
  updateMoodIndicator();
  
  // Pet state update interval
  setInterval(updatePetState, 5000);
}
