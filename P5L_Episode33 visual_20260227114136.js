// {"P5LIVE":{"name":"Episode33 visual","mod":1772192496256}} 

// libs: fft
let visualMode = 0; // 0: Verse, 1: Chorus
let glitch = false; // glitchy effect
let kaleidoscope = false; // kaleidoscope

let neuros = [];
let letters = [];
let alphabets = "アィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワン";

let speedMult = 1;   
let gravity = 0.3;      
let connectDist = 130; 
let bgAlpha = 10; 

function setup() { 
  createCanvas(windowWidth, windowHeight);
  textFont('Courier New', 24);
  for (let i = 0; i < 50; i++) letters.push(new Letter());
  for (let i = 0; i < 70; i++) neuros.push(new Neuron());
}

function draw() {
  background(0, bgAlpha);

  // glitch
  if (glitch === true && random(1) > 0.8) {
    applyGlitchEffect();
  }
  
  if (kaleidoscope) {
    translate(width / 2, height / 2);
    for (let i = 0; i < 4; i++) { 
      rotate(PI / 2);
      push();
      drawScene();
      pop();
    }
  } else {
  	drawScene()
  	//
  }
  
  // drawScanlines()
}

function drawScene(){
  push(); 
  if (visualMode === 1) {
    translate(width / 2, height / 2);
    rotate(frameCount * 0.01);
    translate(-width / 2, -height / 2);
  }
  
  for (let l of letters){
  	l.update()
	// l.display()
  	//
  }
  
  for (let n of neuros) {
    n.update();
    n.attract(neuros);
    n.display();
  }
  pop();
}

function applyGlitchEffect() {
  for (let i = 0; i < 5; i++) {
    let y = random(height);
    let h = random(5, 30);
    let xOffset = random(-30, 30);
    copy(0, y, width, h, xOffset, y, width, h);
  }
  if (random(1) > 0.9) {
    push();
    blendMode(DIFFERENCE);
    fill(255, random(100)); 
    rect(0, 0, width, height);
    pop();
  }
}

function drawScanlines() {
  stroke(255, 10); 
  for (let i = 0; i < height; i += 5) {
    line(0, i, width, i);
  }
  for (let i = 0; i < 500; i++) {
    stroke(255, random(20));
    point(random(width), random(height));
  }
}

class Neuron {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
  }
  update() {
    this.pos.add(p5.Vector.mult(this.vel, speedMult));
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }
  attract(others) {
    this.nearest = [];
    for (let o of others) {
      let d = dist(this.pos.x, this.pos.y, o.pos.x, o.pos.y);
      if (d > 0 && d < connectDist) { 
        this.nearest.push(o);
      }
    }
  }
  display() {
    let nCol = lerpColor(color(0, 50, 255), color(255), map(sin(frameCount * 0.02), -1, 1, 0, 1));
    
    if (visualMode === 1) {
      strokeWeight(2);
      fill(nCol, 30);
      beginShape(TRIANGLES);
      for (let i = 0; i < min(this.nearest.length, 2); i++) {
        vertex(this.pos.x, this.pos.y);
        vertex(this.nearest[i].pos.x, this.nearest[i].pos.y);
      }
      endShape();
    } else {
      strokeWeight(0.5);
    }
    stroke(nCol);
    for (let o of this.nearest) line(this.pos.x, this.pos.y, o.pos.x, o.pos.y);
    fill(nCol);
    circle(this.pos.x, this.pos.y, 4);
  }
}

class Letter {
  constructor() {
    this.reset();
  }
  reset() {
    this.pos = createVector(random(width), random(-height, 0));
    this.t = random(alphabets.split(''));
  }
  update() {
    let dropSpeed = gravity * 10;
    if (visualMode === 1) dropSpeed *= 5; 
    this.pos.y += dropSpeed; 
    if (this.pos.y > height) this.reset();
  }
  display() {
    push();
    noStroke();
    fill(0, 255, 0, 100);
    text(this.t, this.pos.x, this.pos.y);
    pop();
  }
}