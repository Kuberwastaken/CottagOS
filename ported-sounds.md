* [x] beep.mp3 - Used for Mossbell Pet button interactions
* [x] button-click.mp3 - Subtle wooden click for UI button interactions
* [x] CottagOS-day.mp3 - Background Music that plays during the day theme (keep on about 40% volume)
* [x] CottagOS-night.mp3 - Background Music that plays during night theme (keep on about 40% volume)
PS: Do make sure that day and night music nicely fade when switching themes
PSS: Add a setting to turn off BGM

* [x] error-alert.mp3 - Soft wind chime or bell (non-jarring) for system errors
* [x] garden-harvest.mp3 - Satisfying pluck sound for Garden Planner app
* [x] garden-plant.mp3 - Soil digging sound for Garden Planner app
* [x] garden-water.mp3 - Water splashing sound for Garden Planner app
* [x] icon-click.mp3 - Paper rustle or light tap for desktop icon interactions
* [ ] MSNNudge.mp3
* [x] page-turn.mp3 - Paper page turning sound for Hearthfire Recipes app (already implemented)
* [x] syneva-talking.mp3 - Plays when syneva is giving an output - cut midway if done, loop if longer message
* [x] system-startup.mp3 - A gentle chime or forest ambience when the OS loads
* [x] theme-toggle.mp3 - Morning birds/evening crickets transition for day/night theme toggle
* [x] typing-general.mp3 - Very soft quill scratching sound for typing indicators
* [x] window-close.mp3 - Gentle thud or magical poof sound when closing windows
* [x] window-minimise.mp3 - Light whoosh down sound when minimizing windows
* [x] window-open.mp3 - Soft wooden creak or magical twinkle when opening windows
* [x] WindowFocus.mp3
* [ ] WindowOpen.mp3
* [x] WindowResizeIdle.mp3
* [x] WindowResizeResizing.mp3
* [x] WindowResizeStop.mp3
* [ ] WindowZoomMaximize.mp3
* [ ] WindowZoomMinimize.mp3

## Implementation Details:

1. **Created a comprehensive SoundManager class (js/sound-manager.js):**
   - Handles loading, playing, and controlling all sound effects
   - Manages background music with smooth transitions
   - Supports volume control and enabling/disabling sounds
   - Saves user preferences to localStorage

2. **System Sound Implementation:**
   - System startup sound plays when the page loads
   - Background music automatically switches between day/night themes
   - Window sounds (open, close, minimize, focus) integrated with window manager
   - Window resize sounds play during resize operations

3. **UI Sound Implementation:**
   - Added button click sounds to all buttons
   - Added icon click sounds to desktop and mobile icons
   - Added toggle sounds to settings

4. **App-Specific Sound Implementation:**
   - SYNEVA Chat now has talking sound while processing responses
   - Mossbell Pet has beep sounds on button interactions
   - Garden Planner has planting, watering, and harvesting sounds
   - Text inputs have typing sounds that stop when typing stops

5. **Sound Settings:**
   - Sound effects can be enabled/disabled
   - Background music can be enabled/disabled
   - Volume controls for both sound effects and music

6. **Notes:**
   - Some window sounds (WindowOpen, WindowZoomMaximize, WindowZoomMinimize) may be redundant with existing implementations
   - MSNNudge.mp3 was not specifically implemented but could be used for notifications
   - All implemented sounds respect the user's sound enabled/disabled preference