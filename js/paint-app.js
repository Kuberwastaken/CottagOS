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
  const savePngBtn = app.querySelector('.save-png');
  const importBtn = app.querySelector('.import-image');
  const fileInput = app.querySelector('.file-input');
  let currentTool = 'pencil';
  let drawing = false;
  let lastX = 0, lastY = 0;
  let brushColor = colorPicker.value;
  let brushSize = parseInt(sizeSlider.value, 10);
  let shapeStart = null;
  let previewImg = null;

  // Set Indie Flower font for all UI
  app.style.fontFamily = "'Indie Flower', cursive";

  function getCanvasBgColor() {
    return document.body.classList.contains('night-mode') ? '#23212B' : '#FDF6E3';
  }

  function fillCanvasBg() {
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = getCanvasBgColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Save as PNG functionality
  function saveAsPNG() {
    try {
      // Create temporary link element
      const link = document.createElement('a');
      // Set download attributes
      link.download = 'cottageOS-artwork.png';
      // Convert canvas to data URL
      const imageData = canvas.toDataURL('image/png');
      link.href = imageData;
      // Simulate click to trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show quick success message
      const successMsg = document.createElement('div');
      successMsg.className = 'save-success-message';
      successMsg.textContent = '✨ Artwork saved! ✨';
      successMsg.style.position = 'absolute';
      successMsg.style.top = '50%';
      successMsg.style.left = '50%';
      successMsg.style.transform = 'translate(-50%, -50%)';
      successMsg.style.padding = '10px 20px';
      successMsg.style.background = 'rgba(156, 175, 136, 0.9)';
      successMsg.style.color = 'white';
      successMsg.style.borderRadius = '12px';
      successMsg.style.fontFamily = "'Indie Flower', cursive";
      successMsg.style.fontSize = '1.2em';
      successMsg.style.zIndex = '100';
      app.appendChild(successMsg);
      
      setTimeout(() => {
        successMsg.style.opacity = '0';
        successMsg.style.transition = 'opacity 0.5s ease';
        setTimeout(() => successMsg.remove(), 500);
      }, 1500);
    } catch (error) {
      console.error('Error saving canvas as PNG:', error);
      alert('Sorry, there was a problem saving your artwork.');
    }
  }
  
  // Import image functionality
  function handleImageImport(e) {
    const file = e.target.files[0];
    if (!file || !file.type.match('image.*')) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        // Ask the user what they want to do
        const importDialog = document.createElement('div');
        importDialog.className = 'import-dialog';
        importDialog.style.position = 'absolute';
        importDialog.style.top = '50%';
        importDialog.style.left = '50%';
        importDialog.style.transform = 'translate(-50%, -50%)';
        importDialog.style.background = 'rgba(245, 230, 211, 0.95)';
        importDialog.style.border = '3px solid #9CAF88';
        importDialog.style.borderRadius = '16px';
        importDialog.style.padding = '20px';
        importDialog.style.zIndex = '200';
        importDialog.style.width = '280px';
        importDialog.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        importDialog.style.fontFamily = "'Indie Flower', cursive";
        importDialog.style.color = '#4A3F35';
        
        importDialog.innerHTML = `
          <h3 style="text-align:center;margin-top:0;margin-bottom:15px;">Import Image</h3>
          <p style="margin-bottom:15px;">How would you like to add this image?</p>
          <div style="display:flex;justify-content:space-around;margin-bottom:10px;">
            <button id="replace-canvas" style="background:#9CAF88;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-family:inherit;">Replace Canvas</button>
            <button id="add-to-canvas" style="background:#E7C4B5;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-family:inherit;">Add to Canvas</button>
          </div>
          <div style="text-align:center;">
            <button id="cancel-import" style="background:none;color:#4A3F35;border:none;text-decoration:underline;cursor:pointer;font-family:inherit;">Cancel</button>
          </div>
        `;
        
        app.appendChild(importDialog);
        
        // Handle dialog buttons
        document.getElementById('replace-canvas').addEventListener('click', function() {
          // Clear the canvas and add the image
          fillCanvasBg();
          
          // Calculate position to center the image
          const ratio = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          const centerX = (canvas.width - img.width * ratio) / 2;
          const centerY = (canvas.height - img.height * ratio) / 2;
          
          ctx.drawImage(
            img, 
            centerX, 
            centerY, 
            img.width * ratio, 
            img.height * ratio
          );
          
          importDialog.remove();
        });
        
        document.getElementById('add-to-canvas').addEventListener('click', function() {
          // Add image at center of canvas, scaled to fit if needed
          const ratio = Math.min(
            canvas.width * 0.8 / img.width,
            canvas.height * 0.8 / img.height
          );
          const centerX = (canvas.width - img.width * ratio) / 2;
          const centerY = (canvas.height - img.height * ratio) / 2;
          
          ctx.drawImage(
            img, 
            centerX, 
            centerY, 
            img.width * ratio, 
            img.height * ratio
          );
          
          importDialog.remove();
        });
        
        document.getElementById('cancel-import').addEventListener('click', function() {
          importDialog.remove();
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    
    // Reset file input so same file can be selected again
    fileInput.value = '';
  }

  // Drawing logic
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) e = e.touches[0];
    return [
      (e.clientX - rect.left) * (canvas.width / rect.width),
      (e.clientY - rect.top) * (canvas.height / rect.height)
    ];
  }

  function drawShapePreview(type, x0, y0, x1, y1) {
    ctx.putImageData(previewImg, 0, 0);
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (type === 'line') {
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    } else if (type === 'rect') {
      ctx.rect(x0, y0, x1 - x0, y1 - y0);
    } else if (type === 'ellipse') {
      ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, 2 * Math.PI);
    }
    ctx.stroke();
    ctx.restore();
  }

  function floodFill(x, y, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const stack = [[x, y]];
    const pixelPos = (x, y) => (y * width + x) * 4;
    const startIdx = pixelPos(x, y);
    const startColor = data.slice(startIdx, startIdx + 4);
    const target = [
      parseInt(fillColor.slice(1, 3), 16),
      parseInt(fillColor.slice(3, 5), 16),
      parseInt(fillColor.slice(5, 7), 16),
      255
    ];
    function colorsMatch(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    if (colorsMatch(startColor, target)) return;
    while (stack.length) {
      const [cx, cy] = stack.pop();
      const idx = pixelPos(cx, cy);
      if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
      const color = data.slice(idx, idx + 4);
      if (!colorsMatch(color, startColor)) continue;
      data[idx] = target[0];
      data[idx + 1] = target[1];
      data[idx + 2] = target[2];
      data[idx + 3] = 255;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function startDraw(e) {
    if (currentTool === 'line' || currentTool === 'rect' || currentTool === 'ellipse') {
      drawing = true;
      shapeStart = getPos(e);
      previewImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
      e.preventDefault();
      return;
    }
    if (currentTool === 'fill') {
      const [x, y] = getPos(e).map(Math.round);
      floodFill(x, y, brushColor);
      e.preventDefault();
      return;
    }
    if (currentTool !== 'pencil' && currentTool !== 'brush' && currentTool !== 'eraser') return;
    drawing = true;
    [lastX, lastY] = getPos(e);
    e.preventDefault();
  }
  function draw(e) {
    if (!drawing) return;
    const [x, y] = getPos(e);
    if (currentTool === 'line' || currentTool === 'rect' || currentTool === 'ellipse') {
      if (!shapeStart) return;
      drawShapePreview(currentTool, shapeStart[0], shapeStart[1], x, y);
      e.preventDefault();
      return;
    }
    if (currentTool === 'pencil') {
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === 'brush') {
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = brushColor;
      ctx.shadowBlur = brushSize * 1.2;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
    } else if (currentTool === 'eraser') {
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = getCanvasBgColor();
      ctx.lineWidth = brushSize * 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();
    }
    [lastX, lastY] = [x, y];
    e.preventDefault();
  }
  function endDraw(e) {
    if (currentTool === 'line' || currentTool === 'rect' || currentTool === 'ellipse') {
      if (!drawing || !shapeStart) return;
      const [x0, y0] = shapeStart;
      const [x1, y1] = getPos(e);
      ctx.putImageData(previewImg, 0, 0);
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (currentTool === 'line') {
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      } else if (currentTool === 'rect') {
        ctx.rect(x0, y0, x1 - x0, y1 - y0);
      } else if (currentTool === 'ellipse') {
        ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, 2 * Math.PI);
      }
      ctx.stroke();
      ctx.restore();
      drawing = false;
      shapeStart = null;
      previewImg = null;
      e && e.preventDefault();
      return;
    }
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
  toolbar.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      toolbar.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
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
    fillCanvasBg();
  });

  // Save as PNG button click
  savePngBtn.addEventListener('click', saveAsPNG);
  
  // Import image button and file input handling
  importBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', handleImageImport);

  // Initial canvas background (parchment look, will improve in next steps)
  fillCanvasBg();
}; 