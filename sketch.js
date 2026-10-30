
// ======================================
// BUNNY PARTY
// NewJeans Character Generative Art
// ======================================

let bunnyImg;
let omgImg;

let bunnies = [];
let logos = [];
let particles = [];

const TOTAL = 12;
const COLORS = [
  "#FF8EAB",
  "#80CBEA",
  "#FFD86B",
  "#B9D99D",
  "#C7A9EB"
];

let px = -1000;
let py = -1000;
let touching = false;
let lastTap = 0;

function preload() {
  bunnyImg = loadImage("nj01.png");
  omgImg = loadImage("nj08.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  imageMode(CENTER);

  resetScene();
}

function resetScene() {
  bunnies = [];
  logos = [];
  particles = [];

  for (let i = 0; i < TOTAL; i++) {
    bunnies.push({
      x: random(width),
      y: random(height),
      vx: random(-2.5, 2.5),
      vy: random(-2.5, 2.5),
      size: random(65, 105),
      angle: random(TWO_PI),
      spin: random(-0.025, 0.025),
      color: random(COLORS),
      bounce: 0
    });
  }

  for (let i = 0; i < 3; i++) {
    logos.push({
      x: random(width),
      y: random(height),
      vx: random(-0.8, 0.8),
      vy: random(-0.8, 0.8),
      angle: random(TWO_PI),
      spin: random(-0.008, 0.008),
      size: random(125, 190)
    });
  }
}

function draw() {
  background("#FFF7EC");

  // Background OMG graphics
  for (let l of logos) {
    l.x += l.vx;
    l.y += l.vy;
    l.angle += l.spin;

    if (l.x < 60 || l.x > width - 60) l.vx *= -1;
    if (l.y < 60 || l.y > height - 60) l.vy *= -1;

    push();
    translate(l.x, l.y);
    rotate(l.angle);
    tint(255, 65);
    image(omgImg, 0, 0, l.size, l.size);
    noTint();
    pop();
  }

  // Touch attracts bunnies
  if (touching) {
    for (let b of bunnies) {
      let dx = px - b.x;
      let dy = py - b.y;
      let d = dist(px, py, b.x, b.y);

      if (d < 230 && d > 5) {
        b.vx += dx / d * 0.12;
        b.vy += dy / d * 0.12;
      }

      b.vx = constrain(b.vx, -6, 6);
      b.vy = constrain(b.vy, -6, 6);
    }

    noFill();
    stroke("#FF8EAB");
    strokeWeight(2);
    circle(px, py, 35 + sin(frameCount * 0.15) * 10);
  }

  // Bunny movement
  for (let b of bunnies) {
    b.x += b.vx;
    b.y += b.vy;

    b.angle += b.spin;
    b.vx *= 0.997;
    b.vy *= 0.997;

    let r = b.size * 0.4;

    if (b.x < r || b.x > width - r) {
      b.vx *= -1;
      b.x = constrain(b.x, r, width - r);
      burst(b.x, b.y, 4);
    }

    if (b.y < r || b.y > height - r) {
      b.vy *= -1;
      b.y = constrain(b.y, r, height - r);
      burst(b.x, b.y, 4);
    }

    if (abs(b.vx) + abs(b.vy) < 0.5) {
      b.vx += random(-0.15, 0.15);
      b.vy += random(-0.15, 0.15);
    }

    b.bounce *= 0.85;

    push();
    translate(b.x, b.y);
    rotate(b.angle);
    scale(1 + b.bounce);
    image(bunnyImg, 0, 0, b.size, b.size);
    pop();
  }

  // Collisions
  for (let i = 0; i < bunnies.length; i++) {
    for (let j = i + 1; j < bunnies.length; j++) {
      let a = bunnies[i];
      let b = bunnies[j];

      if (dist(a.x, a.y, b.x, b.y) <
          (a.size + b.size) * 0.35) {

        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = max(1, sqrt(dx * dx + dy * dy));

        a.vx -= dx / d * 0.5;
        a.vy -= dy / d * 0.5;
        b.vx += dx / d * 0.5;
        b.vy += dy / d * 0.5;

        a.bounce = 0.25;
        b.bounce = 0.25;
      }
    }
  }

  // Particles
  updateParticles();
}

// --------------------------------
// PARTICLES
// --------------------------------

function burst(x, y, n) {
  for (let i = 0; i < n; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-3, 3),
      vy: random(-3, 3),
      life: 255,
      size: random(3, 8),
      color: random(COLORS)
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

// --------------------------------
// TOUCH AND MOUSE
// --------------------------------

function pressAction() {
  px = mouseX;
  py = mouseY;

  let now = millis();

  if (now - lastTap < 350) {
    resetScene();
    lastTap = 0;
    return;
  }

  lastTap = now;
  touching = true;
  burst(px, py, 20);
}

function moveAction() {
  px = mouseX;
  py = mouseY;
  burst(px, py, 1);
}

function touchStarted() {
  pressAction();
  return false;
}

function touchMoved() {
  moveAction();
  return false;
}

function touchEnded() {
  touching = false;
  return false;
}

function mousePressed() {
  pressAction();
}

function mouseDragged() {
  moveAction();
}

function mouseReleased() {
  touching = false;
}

// --------------------------------
// RESIZE
// --------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
