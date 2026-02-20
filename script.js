const frameCount = 240; // Total number of frames
const canvas = document.getElementById("animationCanvas");
const context = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Generate frame file path
const currentFrame = (index) =>
  `frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

const images = [];
let loadedImages = 0;

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    loadedImages++;
    if (loadedImages === 1) {
      // Draw first frame immediately
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };
  images.push(img);
}

// Draw frame based on index
function drawFrame(index) {
  const img = images[index];
  if (!img) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Maintain aspect ratio (cover effect)
  const canvasRatio = canvas.width / canvas.height;
  const imageRatio = img.width / img.height;

  let drawWidth, drawHeight;

  if (canvasRatio > imageRatio) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imageRatio;
  } else {
    drawHeight = canvas.height;
    drawWidth = canvas.height * imageRatio;
  }

  const offsetX = (canvas.width - drawWidth) / 2;
  const offsetY = (canvas.height - drawHeight) / 2;

  context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Scroll event
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / maxScroll;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  drawFrame(frameIndex);
});

// Handle resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(0);
});
