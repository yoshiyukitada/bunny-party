
// ======================================
// BUNNY PARTY
// Interactive Generative Art
// p5.js / GitHub Pages
// ======================================

let bunnies = [];
let particles = [];
let bunnyImg;

const TOTAL = 14;
let lastTap = 0;
let pointerActive = false;
let pointerX = 0;
let pointerY = 0;

const palette = [
  "#FF83A8",
  "#79C9E8",
  "#FFD65C",
  "#B5D99A",
  "#C6A5E8"
];

function preload() {
  bunnyImg = loadImage(
    "assets/bunny.png",
    () => {},
    () => {
      bunnyImg = null;
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  imageMode(CENTER);

  for (let i = 0; i < TOTAL; i++) {
    createBunny();
  }
}

function createBunny() {
  let size = random(65, 105);

  bunnies.push({
    x: random(50, width - 50),
    y: random(80, height - 80),

    vx: random(-2.5, 2.5),
    vy: random(-2.5, 2.5),

    size: size,
    angle: random(TWO_PI),
    spin: random(-0.025, 0.025),

    color: random(palette),
    bounce: 0,
    scale: 1
  });
}

function draw() {
  background("#FFF7E9");

  // Background dots
  noStroke();

  for (let i = 0; i < 35; i++) {
    fill(235, 220, 195, 75);
    circle(
      (i * 137) % width,
      (i * 211) % height,
      3
    );
  }

  // Finger attraction
  if (pointerActive) {
    attractBunnies();
    drawTouchEffect();
  }

  // Bunny physics
  for (let b of bunnies) {
    updateBunny(b);
  }

  // Bunny collisions
  for (let i = 0; i < bunnies.length; i++) {
    for (let j = i + 1; j < bunnies.length; j++) {
      collide(bunnies[i], bunnies[j]);
    }
  }

  // Draw bunnies
  for (let b of bunnies) {
    drawBunny(b);
  }

  // Particles
  updateParticles();
}

// --------------------------------------
// BUNNY MOVEMENT
// --------------------------------------

function updateBunny(b) {

  b.x += b.vx;
  b.y += b.vy;

  b.angle += b.spin;

  b.vx *= 0.995;
  b.vy *= 0.995;

  // Keep moving
  if (abs(b.vx) + abs(b.vy) < 0.5) {
    b.vx += random(-0.2, 0.2);
    b.vy += random(-0.2, 0.2);
  }

  // Wall bounce
  let r = b.size * 0.48;

  if (b.x < r || b.x > width - r) {
    b.vx *= -1;
    b.x = constrain(b.x, r, width - r);
    burst(b.x, b.y, 3);
  }

  if (b.y < r || b.y > height - r) {
    b.vy *= -1;
    b.y = constrain(b.y, r, height - r);
    burst(b.x, b.y, 3);
  }

  // Bounce animation
  b.bounce *= 0.85;
  b.scale = 1 + b.bounce;
}

// --------------------------------------
// TOUCH ATTRACTION
// --------------------------------------

function attractBunnies() {

  for (let b of bunnies) {

    let dx = pointerX - b.x;
    let dy = pointerY - b.y;

    let d = sqrt(dx * dx + dy * dy);

    if (d < 220 && d > 5) {

      let force = map(d, 5, 220, 0.12, 0.015);

      b.vx += dx / d * force;
      b.vy += dy / d * force;

      b.vx = constrain(b.vx, -6, 6);
      b.vy = constrain(b.vy, -6, 6);

      b.bounce = 0.15;
    }
  }
}

function drawTouchEffect() {

  noFill();
  stroke(255, 130, 170, 130);
  strokeWeight(2);

  let pulse = 25 + sin(frameCount * 0.15) * 8;

  circle(pointerX, pointerY, pulse);
}

// --------------------------------------
// COLLISIONS
// --------------------------------------

function collide(a, b) {

  let dx = b.x - a.x;
  let dy = b.y - a.y;

  let d = sqrt(dx * dx + dy * dy);
  let minD = (a.size + b.size) * 0.38;

  if (d < minD && d > 0.1) {

    let nx = dx / d;
    let ny = dy / d;

    let overlap = minD - d;

    a.x -= nx * overlap * 0.5;
    a.y -= ny * overlap * 0.5;

    b.x += nx * overlap * 0.5;
    b.y += ny * overlap * 0.5;

    a.vx -= nx * 0.45;
    a.vy -= ny * 0.45;

    b.vx += nx * 0.45;
    b.vy += ny * 0.45;

    a.bounce = 0.3;
    b.bounce = 0.3;
  }
}

// --------------------------------------
// DRAW CHARACTER
// --------------------------------------

function drawBunny(b) {

  push();

  translate(b.x, b.y);
  rotate(b.angle);
  scale(b.scale);

  if (bunnyImg) {

    image(
      bunnyImg,
      0,
      0,
      b.size,
      b.size
    );

  } else {

    // Temporary placeholder
    noStroke();
    fill(b.color);

    ellipse(0, 5, b.size * 0.72, b.size * 0.72);

    ellipse(
      -b.size * 0.2,
      -b.size * 0.36,
      b.size * 0.22,
      b.size * 0.55
    );

    ellipse(
      b.size * 0.2,
      -b.size * 0.36,
      b.size * 0.22,
      b.size * 0.55
    );

    fill("#FFFFFF");
    circle(-b.size * 0.13, 0, 7);
    circle(b.size * 0.13, 0, 7);

    fill("#333333");
    circle(-b.size * 0.13, 0, 3);
    circle(b.size * 0.13, 0, 3);
  }

  pop();
}

// --------------------------------------
// PARTICLES
// --------------------------------------

function burst(x, y, amount) {

  for (let i = 0; i < amount; i++) {

    particles.push({
      x: x,
      y: y,
      vx: random(-3, 3),
      vy: random(-3, 3),
      life: 255,
      size: random(3, 8),
      color: random(palette)
    });
  }
}

function updateParticles() {

  noStroke();

  for (let i = particles.length - 1; i >= 0; i--) {

    let p = particles[i];

    p.x += p.vx;
    p.y += p.vy;

    p.life -= 5;

    fill(p.color);
    drawingContext.globalAlpha = p.life / 255;

    circle(p.x, p.y, p.size);

    drawingContext.globalAlpha = 1;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// --------------------------------------
// TOUCH / MOUSE
// --------------------------------------

function handlePress() {

  pointerX = mouseX;
  pointerY = mouseY;

  let now = millis();

  // Double tap: reset
  if (now - lastTap < 350) {
    resetBunnies();
    lastTap = 0;
    return;
  }

  lastTap = now;

  // Small burst
  burst(pointerX, pointerY, 18);

  pointerActive = true;
}

function handleMove() {

  pointerX = mouseX;
  pointerY = mouseY;

  burst(pointerX, pointerY, 1);
}

function touchStarted() {
  handlePress();
  return false;
}

function touchMoved() {
  handleMove();
  return false;
}

function touchEnded() {
  pointerActive = false;
  return false;
}

function mousePressed() {
  handlePress();
}

function mouseDragged() {
  handleMove();
}

function mouseReleased() {
  pointerActive = false;
}

// --------------------------------------
// RESET
// --------------------------------------

function resetBunnies() {

  bunnies = [];
  particles = [];

  for (let i = 0; i < TOTAL; i++) {
    createBunny();
  }

  burst(width / 2, height / 2, 40);
}

// --------------------------------------
// RESIZE
// --------------------------------------

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  for (let b of bunnies) {
    b.x = constrain(b.x, 40, width - 40);
    b.y = constrain(b.y, 40, height - 40);
  }
}
