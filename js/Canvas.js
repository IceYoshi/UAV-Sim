var drawManager = new DrawManager();

function setup() {
  createCanvas(1000, 1000, WEBGL);

  drawManager.add(new FlightZone(500));
}

function draw() {
  updateCamera();
  drawManager.draw();
}

function updateCamera() {
  rotateX(cameraXOffset * 0.01);
  rotateY(cameraYOffset * 0.01);
  camera(0, 0, 0);
}

var initialMouseX = 0;
var initialMouseY = 0;
function mousePressed() {
  oldMouseX = mouseX;
  oldMouseY = mouseY;
}

var cameraYOffset = 0;
var cameraXOffset = 0;
function mouseDragged() {
  cameraYOffset = mouseX - initialMouseX;
  cameraXOffset = mouseY - initialMouseY;
}
