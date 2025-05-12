// Sound Manager for CottagOS
class SoundManager {
  constructor() {
    this.sounds = {};
    this.bgm = null;
    this.bgmVolume = 0.2; // Quieter: 20% volume for background music
    this.sfxVolume = 0.7; // 70% volume for sound effects
    this.soundsEnabled = true;
    this.bgmEnabled = true;
    
    this.typingSounds = {
      isPlaying: false,
      timeout: null
    };
    
    this.resizeSounds = {
      isResizing: false,
      idleSound: null,
      resizingSound: null
    };
    
    this.init();
  }
  
  init() {
    // Load all sound effects
    this.loadSound('beep', 'assets/sounds/beep.mp3');
    this.loadSound('button-click', 'assets/sounds/button-click.mp3');
    this.loadSound('error-alert', 'assets/sounds/error-alert.mp3');
    this.loadSound('garden-harvest', 'assets/sounds/garden-harvest.mp3');
    this.loadSound('garden-plant', 'assets/sounds/garden-plant.mp3');
    this.loadSound('garden-water', 'assets/sounds/garden-water.mp3');
    this.loadSound('icon-click', 'assets/sounds/icon-click.mp3');
    this.loadSound('msn-nudge', 'assets/sounds/MSNNudge.mp3');
    this.loadSound('page-turn', 'assets/sounds/page-turn.mp3');
    this.loadSound('syneva-talking', 'assets/sounds/syneva-talking.mp3');
    this.loadSound('system-startup', 'assets/sounds/system-startup.mp3');
    this.loadSound('theme-toggle', 'assets/sounds/theme-toggle.mp3');
    this.loadSound('typing-general', 'assets/sounds/typing-general.mp3');
    this.loadSound('window-close', 'assets/sounds/window-close.mp3');
    this.loadSound('window-minimise', 'assets/sounds/window-minimise.mp3');
    this.loadSound('window-open', 'assets/sounds/window-open.mp3');
    this.loadSound('window-focus', 'assets/sounds/WindowFocus.mp3');
    this.loadSound('window-resize-idle', 'assets/sounds/WindowResizeIdle.mp3');
    this.loadSound('window-resize-resizing', 'assets/sounds/WindowResizeResizing.mp3');
    this.loadSound('window-resize-stop', 'assets/sounds/WindowResizeStop.mp3');
    this.loadSound('window-zoom-maximize', 'assets/sounds/WindowZoomMaximize.mp3');
    this.loadSound('window-zoom-minimize', 'assets/sounds/WindowZoomMinimize.mp3');
    
    // Load background music - ensuring correct day/night files
    this.loadBGM('day', 'assets/sounds/CottagOS-day.mp3');
    this.loadBGM('night', 'assets/sounds/CottagOS-night.mp3');
    
    // Initialize from saved settings
    this.loadSettings();
    
    // Enforce 20% volume for BGM regardless of saved settings
    this.setBGMVolume(0.2);
    
    // Test background music objects
    console.log("BGM loaded:", this.bgm);
    
    // Play appropriate BGM based on current theme
    const isNightMode = document.body.classList.contains('night-mode');
    if (this.bgmEnabled) {
      this.playBGM(isNightMode ? 'night' : 'day');
    }
  }
  
  loadSound(name, path) {
    const sound = new Audio(path);
    sound.volume = this.sfxVolume;
    this.sounds[name] = sound;
  }
  
  loadBGM(theme, path) {
    if (!this.bgm) {
      this.bgm = {};
    }
    
    console.log(`Loading BGM for theme "${theme}" from path: ${path}`);
    const music = new Audio(path);
    music.loop = true;
    music.volume = this.bgmVolume;
    this.bgm[theme] = music;
  }
  
  play(name) {
    if (!this.soundsEnabled) return;
    
    const sound = this.sounds[name];
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const soundClone = sound.cloneNode();
      soundClone.volume = this.sfxVolume;
      soundClone.play().catch(err => console.log('Sound play error:', err));
    }
  }
  
  loop(name, shouldLoop = true) {
    if (!this.soundsEnabled) return;
    
    const sound = this.sounds[name];
    if (sound) {
      sound.loop = shouldLoop;
      sound.play().catch(err => console.log('Sound play error:', err));
      return sound;
    }
    return null;
  }
  
  stop(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }
  
  playBGM(theme) {
    if (!this.bgmEnabled) return;
    
    // Ensure correct theme is being used
    console.log(`Playing BGM for theme: ${theme}`);
    
    // Fade out current BGM if playing
    Object.values(this.bgm).forEach(music => {
      if (!music.paused) {
        this.fadeOut(music, 1000);
      }
    });
    
    // Start new BGM with fade in
    const music = this.bgm[theme];
    if (music) {
      music.volume = 0;
      music.play().catch(err => console.log('BGM play error:', err));
      this.fadeIn(music, 1000);
    } else {
      console.error(`BGM for theme "${theme}" not found. Available themes:`, Object.keys(this.bgm));
    }
  }
  
  stopBGM() {
    Object.values(this.bgm).forEach(music => {
      this.fadeOut(music, 500);
    });
  }
  
  fadeIn(audio, duration) {
    // Use the class property for BGM target volume
    const targetVolume = (audio === this.bgm.day || audio === this.bgm.night) ? this.bgmVolume : this.sfxVolume;
    const step = 20; // Update every 20ms
    const volumeStep = targetVolume / (duration / step);
    
    const fadeInterval = setInterval(() => {
      let newVolume = Math.min(targetVolume, audio.volume + volumeStep);
      if (newVolume >= targetVolume) {
        clearInterval(fadeInterval);
        audio.volume = targetVolume;
      } else {
        audio.volume = newVolume;
      }
    }, step);
  }
  
  fadeOut(audio, duration) {
    const step = 20; // Update every 20ms
    const initialVolume = audio.volume;
    const volumeStep = initialVolume / (duration / step);
    
    const fadeInterval = setInterval(() => {
      let newVolume = Math.max(0, audio.volume - volumeStep);
      if (newVolume <= 0) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = initialVolume; // Reset volume for next play
      } else {
        audio.volume = newVolume;
      }
    }, step);
  }
  
  startTypingSound() {
    if (!this.soundsEnabled) return;
    
    // Clear any existing timeout
    if (this.typingSounds.timeout) {
      clearTimeout(this.typingSounds.timeout);
    }
    
    // Start sound if not already playing
    if (!this.typingSounds.isPlaying) {
      const sound = this.sounds['typing-general'];
      sound.loop = true;
      sound.currentTime = 0;
      sound.play().catch(err => console.log('Typing sound error:', err));
      this.typingSounds.isPlaying = true;
    }
    
    // Set timeout to stop sound after typing stops
    this.typingSounds.timeout = setTimeout(() => {
      this.stopTypingSound();
    }, 1000);
  }
  
  stopTypingSound() {
    if (this.typingSounds.isPlaying) {
      const sound = this.sounds['typing-general'];
      sound.pause();
      sound.currentTime = 0;
      sound.loop = false;
      this.typingSounds.isPlaying = false;
    }
  }
  
  startResizeSound() {
    if (!this.soundsEnabled) return;
    
    if (!this.resizeSounds.isResizing) {
      // Play initial idle sound
      this.play('window-resize-idle');
      
      // Start continuous resizing sound
      const resizingSound = this.sounds['window-resize-resizing'];
      resizingSound.loop = true;
      resizingSound.play().catch(err => console.log('Resize sound error:', err));
      
      this.resizeSounds.isResizing = true;
      this.resizeSounds.resizingSound = resizingSound;
    }
  }
  
  stopResizeSound() {
    if (this.resizeSounds.isResizing) {
      // Stop continuous resizing sound
      if (this.resizeSounds.resizingSound) {
        this.resizeSounds.resizingSound.pause();
        this.resizeSounds.resizingSound.currentTime = 0;
        this.resizeSounds.resizingSound.loop = false;
      }
      
      // Play stop sound
      this.play('window-resize-stop');
      
      this.resizeSounds.isResizing = false;
    }
  }
  
  startSynevaTalking() {
    if (!this.soundsEnabled) return;
    
    const sound = this.sounds['syneva-talking'];
    sound.loop = true;
    sound.play().catch(err => console.log('Syneva talking sound error:', err));
    return sound;
  }
  
  stopSynevaTalking() {
    const sound = this.sounds['syneva-talking'];
    sound.pause();
    sound.currentTime = 0;
    sound.loop = false;
  }
  
  setVolume(volume) {
    this.sfxVolume = volume;
    Object.values(this.sounds).forEach(sound => {
      sound.volume = volume;
    });
    
    localStorage.setItem('cottagOS_sfxVolume', volume);
  }
  
  setBGMVolume(volume) {
    // Ensure volume is capped at 0.2 (20%)
    const newBGMVolume = Math.min(volume, 0.2);
    this.bgmVolume = newBGMVolume; // Update the class property
    
    // Immediately apply to any playing BGM
    Object.values(this.bgm).forEach(music => {
      music.volume = this.bgmVolume;
    });
    
    localStorage.setItem('cottagOS_bgmVolume', this.bgmVolume);
  }
  
  toggleSounds(enabled) {
    this.soundsEnabled = enabled;
    localStorage.setItem('cottagOS_soundsEnabled', enabled);
    
    if (!enabled) {
      // Stop all currently playing sounds
      Object.values(this.sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
      });
      this.stopTypingSound();
    }
  }
  
  toggleBGM(enabled) {
    this.bgmEnabled = enabled;
    localStorage.setItem('cottagOS_bgmEnabled', enabled);
    
    if (enabled) {
      // Start appropriate BGM based on current theme
      const isNightMode = document.body.classList.contains('night-mode');
      this.playBGM(isNightMode ? 'night' : 'day');
    } else {
      this.stopBGM();
    }
  }
  
  loadSettings() {
    // Load volume settings
    const savedSFXVolume = localStorage.getItem('cottagOS_sfxVolume');
    if (savedSFXVolume !== null) {
      this.sfxVolume = parseFloat(savedSFXVolume);
    }
    
    const savedBGMVolume = localStorage.getItem('cottagOS_bgmVolume');
    if (savedBGMVolume !== null) {
      // Cap the BGM volume at 0.2 (20%)
      this.bgmVolume = Math.min(parseFloat(savedBGMVolume), 0.2);
    } else {
        this.bgmVolume = 0.2; // Default to 20% if no saved setting
    }
    
    // Load enabled/disabled settings
    const savedSoundsEnabled = localStorage.getItem('cottagOS_soundsEnabled');
    if (savedSoundsEnabled !== null) {
      this.soundsEnabled = savedSoundsEnabled === 'true';
    }
    
    const savedBGMEnabled = localStorage.getItem('cottagOS_bgmEnabled');
    if (savedBGMEnabled !== null) {
      this.bgmEnabled = savedBGMEnabled === 'true';
    }
  }
}

// Create global sound manager instance
window.soundManager = new SoundManager(); 