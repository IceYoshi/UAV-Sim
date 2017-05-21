var drawManager = new DrawManager();

var canvasWidth;
var canvasHeight;

function setup() {
  canvasWidth = document.getElementById("divCanvas").offsetWidth;
  canvasHeight = document.getElementById("divCanvas").offsetHeight;
  canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
  canvas.parent("divCanvas");

  canvas.mousePressed(canvasMousePressed);
  canvas.mouseOver(canvasMouseOver);
  canvas.mouseOut(canvasMouseOut);

  noiseDetail(8, 0.3);

  initializeDOM();
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
  canvasWidth = document.getElementById("divCanvas").offsetWidth;
  canvasHeight = document.getElementById("divCanvas").offsetHeight;
  resizeCanvas(canvasWidth, canvasHeight);
}
