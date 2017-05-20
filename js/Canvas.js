var drawManager;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noiseDetail(8, 0.3);

  controls = new Controls();
  drawManager = new DrawManager();
  drawManager.initializeObjects();
}

function draw() {
  updateCamera();
  background(Config.flightZone.color);
  drawManager.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
