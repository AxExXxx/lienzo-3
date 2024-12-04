const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let x = 0;
let y = 0;
let brushColor = '#000000';
let brushSize = 5;
let brushOpacity = 1;
let history = [];
let historyIndex = -1;

// Herramientas
document.getElementById('colorPicker').addEventListener('input', (e) => {
  brushColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', (e) => {
  brushSize = e.target.value;
});

document.getElementById('brushOpacity').addEventListener('input', (e) => {
  brushOpacity = e.target.value;
});

// Inicio del dibujo
canvas.addEventListener('mousedown', (e) => startDrawing(e.offsetX, e.offsetY));
canvas.addEventListener('mousemove', (e) => draw(e.offsetX, e.offsetY));
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchstart', (e) => startDrawing(e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop));
canvas.addEventListener('touchmove', (e) => draw(e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop));
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(xPos, yPos) {
  isDrawing = true;
  x = xPos;
  y = yPos;
  saveState();
}

function draw(xPos, yPos) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.globalAlpha = brushOpacity;
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.moveTo(x, y);
  ctx.lineTo(xPos, yPos);
  ctx.stroke();
  x = xPos;
  y = yPos;
}

function stopDrawing() {
  isDrawing = false;
}

// Funciones adicionales
function saveState() {
  history = history.slice(0, historyIndex + 1);
  history.push(canvas.toDataURL());
  historyIndex++;
}

document.getElementById('undo').addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex--;
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = () => ctx.drawImage(img, 0, 0);
  }
});

document.getElementById('redo').addEventListener('click', () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = () => ctx.drawImage(img, 0, 0);
  }
});

// Limpiar
document.getElementById('clearCanvas').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
});

// Guardar imagen
document.getElementById('saveImage').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'mi-obra-de-arte.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Modo oscuro
document.getElementById('toggleDarkMode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
