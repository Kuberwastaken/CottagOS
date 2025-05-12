// Cottagecore Text Editor App
// Main logic for canvas, text boxes, toolbar, and state

(function() {
  // --- Constants ---
  const FONTS = [
    { name: 'Indie Flower', css: 'Indie Flower, cursive' },
    { name: 'Arial', css: 'Arial, sans-serif' },
    { name: 'Cormorant', css: 'Cormorant Garamond, serif' },
    { name: 'Quicksand', css: 'Quicksand, sans-serif' }
  ];
  const FONT_SIZES = [12, 16, 20, 24, 32, 40, 48];
  const PASTEL_COLORS = ['#9CAF88', '#E7C4B5', '#D3C0E6', '#F5E6D3', '#E9B44C', '#B6D8B6', '#F4845F', '#B97EBB'];
  const DEFAULT_FONT = FONTS[0].css;
  const DEFAULT_SIZE = 20;
  const DEFAULT_COLOR = '#4A3F35';

  // --- State ---
  let textBoxes = [];
  let selectedBox = null;
  let undoStack = [];
  let redoStack = [];
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let activeTool = 'select'; // 'select' or 'remove'

  // --- DOM Elements ---
  let editorContainer, toolbar, canvas, tutorialPopup;

  // --- Initialization ---
  function initTextEditorApp(mountNode) {
    // Load Indie Flower font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap';
    document.head.appendChild(fontLink);

    // Main container
    editorContainer = document.createElement('div');
    editorContainer.className = 'cottagecore-text-editor';
    editorContainer.innerHTML = `
      <div class="cottagecore-toolbar" role="toolbar" aria-label="Text Editor Toolbar"></div>
      <div class="cottagecore-canvas"></div>
      <div class="cottagecore-tutorial-popup" style="display:none;"></div>
    `;
    mountNode.appendChild(editorContainer);
    toolbar = editorContainer.querySelector('.cottagecore-toolbar');
    canvas = editorContainer.querySelector('.cottagecore-canvas');
    tutorialPopup = editorContainer.querySelector('.cottagecore-tutorial-popup');

    renderToolbar();
    renderCanvas();
    showTutorialPopupIfFirstTime();

    // Keyboard shortcuts for undo/redo
    editorContainer.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        redo();
      }
    });

    const textarea = mountNode.querySelector('.text-editor-textarea');
    
    // Add typing sound effect
    if (textarea && window.soundManager) {
      textarea.addEventListener('input', function() {
        // Only play if sound effects are enabled
        if (window.soundManager.soundsEnabled) {
          window.soundManager.startTypingSound();
        }
      });
    }
  }

  // --- Toolbar Rendering ---
  function renderToolbar() {
    // Detect dark mode
    const isNight = document.body.classList.contains('night-mode');
    const defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || (isNight ? '#E6E1D3' : '#4A3F35');
    toolbar.innerHTML = `
      <button class="toolbar-btn undo" title="Undo" aria-label="Undo" role="button">&#8630;</button>
      <button class="toolbar-btn redo" title="Redo" aria-label="Redo" role="button">&#8631;</button>
      <select class="toolbar-font" aria-label="Font Family">
        ${FONTS.map(f => `<option value="${f.css}">${f.name}</option>`).join('')}
      </select>
      <select class="toolbar-size" aria-label="Font Size">
        ${FONT_SIZES.map(s => `<option value="${s}">${s}px</option>`).join('')}
      </select>
      <button class="toolbar-btn bold" title="Bold" aria-label="Bold" role="button"><b>B</b></button>
      <button class="toolbar-btn italic" title="Italic" aria-label="Italic" role="button"><i>I</i></button>
      <input type="color" class="toolbar-color" value="${defaultColor.trim()}" title="Text Color" aria-label="Text Color" />
      <button class="toolbar-btn clear" title="Clear Canvas" aria-label="Clear Canvas" role="button">🧹</button>
      <button class="toolbar-btn remove-tool${activeTool === 'remove' ? ' active' : ''}" title="Remove Tool" aria-label="Remove Tool" role="button">&#10006;</button>
      <button class="toolbar-btn save" title="Save" aria-label="Save" role="button">💾</button>
      <button class="toolbar-btn load" title="Load" aria-label="Load" role="button">📂</button>
    `;
    // Add event listeners
    toolbar.querySelector('.undo').onclick = undo;
    toolbar.querySelector('.redo').onclick = redo;
    toolbar.querySelector('.toolbar-font').onchange = e => applyStyle('fontFamily', e.target.value);
    toolbar.querySelector('.toolbar-size').onchange = e => applyStyle('fontSize', e.target.value + 'px');
    toolbar.querySelector('.bold').onclick = () => applyStyle('fontWeight', selectedBox?.style.fontWeight === 'bold' ? 'normal' : 'bold');
    toolbar.querySelector('.italic').onclick = () => applyStyle('fontStyle', selectedBox?.style.fontStyle === 'italic' ? 'normal' : 'italic');
    toolbar.querySelector('.toolbar-color').oninput = e => applyStyle('color', e.target.value);
    toolbar.querySelector('.clear').onclick = () => {
      clearCanvas();
      selectedBox = null;
      toolbar.querySelector('.toolbar-color').value = defaultColor.trim();
    };
    toolbar.querySelector('.remove-tool').onclick = () => {
      activeTool = activeTool === 'remove' ? 'select' : 'remove';
      if (activeTool === 'remove') {
        editorContainer.classList.add('remove-mode');
      } else {
        editorContainer.classList.remove('remove-mode');
      }
      renderToolbar();
    };
    toolbar.querySelector('.save').onclick = saveCanvas;
    toolbar.querySelector('.load').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = evt => loadCanvas(evt.target.result);
          reader.readAsText(file);
        }
      };
      input.click();
    };
    toolbar.querySelectorAll('select').forEach(sel => {
      sel.style.color = defaultColor.trim();
      sel.style.background = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-btn');
    });
  }

  // --- Canvas Rendering ---
  function renderCanvas() {
    canvas.className = 'cottagecore-canvas';
    canvas.innerHTML = '';
    canvas.onclick = e => {
      if (e.target === canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createTextBox(x, y);
      }
    };
    // Render all text boxes
    textBoxes.forEach(box => {
      canvas.appendChild(box.el);
    });
    
    // Make sure canvas fills the available height without breaking functionality
    const updateCanvasHeight = () => {
      try {
        const windowElement = editorContainer.closest('.cottage-window');
        if (!windowElement) return;
        
        const windowHeight = windowElement.clientHeight;
        const toolbarHeight = toolbar.offsetHeight;
        const titlebarElement = windowElement.querySelector('.window-titlebar');
        const titlebarHeight = titlebarElement ? titlebarElement.offsetHeight : 0;
        const availableHeight = windowHeight - toolbarHeight - titlebarHeight;
        
        // Don't set a fixed height that could break functionality
        canvas.style.minHeight = Math.max(320, availableHeight) + 'px';
      } catch (error) {
        console.error('Error updating canvas height:', error);
        // Fallback to a safe minimum height
        canvas.style.minHeight = '320px';
      }
    };
    
    // Update height on window resize
    updateCanvasHeight();
    
    try {
      const resizeObserver = new ResizeObserver(updateCanvasHeight);
      const windowElement = editorContainer.closest('.cottage-window');
      if (windowElement) {
        resizeObserver.observe(windowElement);
      }
    } catch (error) {
      console.error('Error setting up resize observer:', error);
      // Fallback to window resize event
      window.addEventListener('resize', updateCanvasHeight);
    }
  }

  // --- Text Box Creation & Editing ---
  function createTextBox(x, y) {
    const el = document.createElement('div');
    el.className = 'text-box';
    el.contentEditable = true;
    el.setAttribute('role', 'textbox');
    el.setAttribute('aria-label', 'Text Box');
    el.style.position = 'absolute';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.fontFamily = DEFAULT_FONT;
    el.style.fontSize = DEFAULT_SIZE + 'px';
    const isNight = document.body.classList.contains('night-mode');
    const defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || (isNight ? '#E6E1D3' : '#4A3F35');
    el.style.color = defaultColor.trim();
    el.style.minWidth = '100px';
    el.style.minHeight = '40px';
    el.style.padding = '8px 12px';
    el.style.borderRadius = '12px';
    el.style.background = 'var(--text-box-bg)';
    el.style.border = '2px solid var(--text-box-border)';
    el.style.outline = 'none';
    el.style.zIndex = 10;
    el.innerText = '';
    el.focus();
    const box = { el, x, y, styles: {}, text: '', id: Date.now() + Math.random() };
    textBoxes.push(box);
    selectTextBox(box);
    // Dragging
    el.onmousedown = e => {
      if (e.target !== el) return;
      isDragging = true;
      dragOffset.x = e.offsetX;
      dragOffset.y = e.offsetY;
      selectedBox = box;
      el.classList.add('selected');
      document.onmousemove = moveEvt => {
        if (!isDragging) return;
        const rect = canvas.getBoundingClientRect();
        let nx = moveEvt.clientX - rect.left - dragOffset.x;
        let ny = moveEvt.clientY - rect.top - dragOffset.y;
        el.style.left = nx + 'px';
        el.style.top = ny + 'px';
        box.x = nx;
        box.y = ny;
      };
      document.onmouseup = () => {
        isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
        pushUndo();
      };
    };
    // Editing
    el.onfocus = () => selectTextBox(box);
    el.oninput = () => {
      box.text = el.innerText;
      pushUndo();
    };
    // Remove double-click delete and X button
    // Remove tool logic
    el.onclick = e => {
      if (activeTool === 'remove') {
        deleteTextBox(box);
        e.stopPropagation();
      }
    };
    canvas.appendChild(el);
    pushUndo();
  }

  function selectTextBox(box) {
    textBoxes.forEach(b => b.el.classList.remove('selected'));
    if (box) {
      box.el.classList.add('selected');
      selectedBox = box;
      // Sync toolbar
      const fontSel = toolbar.querySelector('.toolbar-font');
      const sizeSel = toolbar.querySelector('.toolbar-size');
      const colorInp = toolbar.querySelector('.toolbar-color');
      fontSel.value = box.el.style.fontFamily;
      sizeSel.value = parseInt(box.el.style.fontSize);
      colorInp.value = rgbToHex(box.el.style.color);
    }
  }

  function deleteTextBox(box) {
    box.el.remove();
    textBoxes = textBoxes.filter(b => b !== box);
    selectedBox = null;
    pushUndo();
  }

  function applyStyle(style, value) {
    if (!selectedBox) return;
    selectedBox.el.style[style] = value;
    selectedBox.styles[style] = value;
    pushUndo();
  }

  // --- Undo/Redo ---
  function pushUndo() {
    undoStack.push(serializeCanvas());
    redoStack = [];
  }
  function undo() {
    if (undoStack.length > 1) {
      redoStack.push(undoStack.pop());
      loadCanvas(undoStack[undoStack.length - 1], true);
    }
  }
  function redo() {
    if (redoStack.length) {
      const state = redoStack.pop();
      loadCanvas(state, true);
      undoStack.push(state);
    }
  }

  // --- Save/Load ---
  function saveCanvas() {
    const data = serializeCanvas();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cottagecore-text-canvas.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  function loadCanvas(data, isUndo) {
    let obj;
    try {
      obj = typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return;
    }
    textBoxes.forEach(b => b.el.remove());
    textBoxes = [];
    (obj.textBoxes || []).forEach(boxData => {
      const el = document.createElement('div');
      el.className = 'text-box';
      el.contentEditable = true;
      el.setAttribute('role', 'textbox');
      el.setAttribute('aria-label', 'Text Box');
      el.style.position = 'absolute';
      el.style.left = boxData.x + 'px';
      el.style.top = boxData.y + 'px';
      Object.entries(boxData.styles || {}).forEach(([k, v]) => el.style[k] = v);
      el.style.background = 'var(--text-box-bg)';
      el.style.border = '2px solid var(--text-box-border)';
      el.style.outline = 'none';
      el.style.zIndex = 10;
      el.innerText = boxData.text;
      // Remove tool logic
      el.onclick = e => {
        if (activeTool === 'remove') {
          deleteTextBox(textBoxes[textBoxes.length]);
          e.stopPropagation();
        }
      };
      canvas.appendChild(el);
      textBoxes.push({ el, ...boxData });
      el.onfocus = () => selectTextBox(textBoxes[textBoxes.length - 1]);
      el.onmousedown = e => {
        if (e.target !== el) return;
        isDragging = true;
        dragOffset.x = e.offsetX;
        dragOffset.y = e.offsetY;
        selectedBox = textBoxes[textBoxes.length - 1];
        el.classList.add('selected');
        document.onmousemove = moveEvt => {
          if (!isDragging) return;
          const rect = canvas.getBoundingClientRect();
          let nx = moveEvt.clientX - rect.left - dragOffset.x;
          let ny = moveEvt.clientY - rect.top - dragOffset.y;
          el.style.left = nx + 'px';
          el.style.top = ny + 'px';
          textBoxes[textBoxes.length - 1].x = nx;
          textBoxes[textBoxes.length - 1].y = ny;
        };
        document.onmouseup = () => {
          isDragging = false;
          document.onmousemove = null;
          document.onmouseup = null;
          pushUndo();
        };
      };
      el.oninput = () => {
        textBoxes[textBoxes.length - 1].text = el.innerText;
        pushUndo();
      };
    });
    if (!isUndo) pushUndo();
  }
  function serializeCanvas() {
    return JSON.stringify({
      textBoxes: textBoxes.map(b => ({
        x: b.x,
        y: b.y,
        styles: b.styles,
        text: b.el.innerText,
        id: b.id
      }))
    });
  }

  // --- Clear Canvas ---
  function clearCanvas() {
    textBoxes.forEach(b => b.el.remove());
    textBoxes = [];
    selectedBox = null;
    pushUndo();
  }

  // --- Tutorial Pop-up ---
  function showTutorialPopupIfFirstTime() {
    if (!localStorage.getItem('cottagecoreTextEditorTutorial')) {
      tutorialPopup.innerHTML = `
        <div class="tutorial-parchment">
          <h2>Welcome to your Cottagecore Text Editor!</h2>
          <p>Click the canvas to add text, then style it using the toolbar. Enjoy creating!</p>
          <button class="got-it-btn">Got it!</button>
        </div>
      `;
      tutorialPopup.style.display = 'block';
      tutorialPopup.querySelector('.got-it-btn').onclick = () => {
        tutorialPopup.style.display = 'none';
        localStorage.setItem('cottagecoreTextEditorTutorial', '1');
      };
    }
  }

  // --- Utility ---
  function rgbToHex(rgb) {
    if (!rgb) return DEFAULT_COLOR;
    const result = rgb.match(/\d+/g);
    if (!result) return DEFAULT_COLOR;
    return (
      '#' +
      result
        .slice(0, 3)
        .map(x => (+x).toString(16).padStart(2, '0'))
        .join('')
    );
  }

  // --- Expose to global ---
  window.initCottagecoreTextEditor = initTextEditorApp;
})(); 