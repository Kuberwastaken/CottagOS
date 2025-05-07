// Paint App - Cottagecore Edition
// Step 1: Core UI & Basic Drawing

window.initCottagecorePaintApp = function(mount) {
  // Use the template structure, so just find elements
  const app = mount.closest('.cottagecore-paint-app') || mount;
  const canvas = app.querySelector('.paint-canvas');
  const ctx = canvas.getContext('2d');
  const toolbar = app.querySelector('.paint-toolbar');
  const colorPicker = app.querySelector('.paint-color-picker');
  const sizeSlider = app.querySelector('.paint-size-slider');
  const clearBtn = app.querySelector('.clear-canvas');
  let currentTool = 'pencil';
  let drawing = false;
  let lastX = 0, lastY = 0;
  let brushColor = colorPicker.value;
  let brushSize = parseInt(sizeSlider.value, 10);

  // Set Indie Flower font for all UI
  app.style.fontFamily = "'Indie Flower', cursive";

  // Drawing logic
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) e = e.touches[0];
    return [
      (e.clientX - rect.left) * (canvas.width / rect.width),
      (e.clientY - rect.top) * (canvas.height / rect.height)
    ];
  }

  function startDraw(e) {
    if (currentTool !== 'pencil' && currentTool !== 'brush') return;
    drawing = true;
    [lastX, lastY] = getPos(e);
    e.preventDefault();
  }
  function draw(e) {
    if (!drawing) return;
    if (currentTool !== 'pencil' && currentTool !== 'brush') return;
    const [x, y] = getPos(e);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
    e.preventDefault();
  }
  function endDraw(e) {
    drawing = false;
    e && e.preventDefault();
  }

  // Event listeners for canvas
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', endDraw);

  // Tool selection
  toolbar.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toolbar.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTool = btn.getAttribute('data-tool');
    });
  });
  toolbar.querySelector('.tool-btn[data-tool="pencil"]').classList.add('active');

  // Color picker
  colorPicker.addEventListener('input', e => {
    brushColor = e.target.value;
  });

  // Brush size slider
  sizeSlider.addEventListener('input', e => {
    brushSize = parseInt(e.target.value, 10);
  });

  // Clear canvas
  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Initial canvas background (parchment look, will improve in next steps)
  ctx.fillStyle = '#FDF6E3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}; 