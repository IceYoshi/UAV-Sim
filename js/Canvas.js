var drawManager = new DrawManager();

// Global simulation settings
var flightZoneSize = Config.flightZone.minSize;
var wobbling = true;
var collision = true;
var chasing = false;
var formation = false;

// DOM objects
var velocitySlider;
var settingsInfo;
var cameraControlEnabled = true
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
  initializeObjects();
}

function initializeObjects() {
  drawManager.add(new FlightZone(flightZoneSize.width, flightZoneSize.height, flightZoneSize.depth));
  setupDelegate = new UAVManager();
  drawManager.add(setupDelegate);
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

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
