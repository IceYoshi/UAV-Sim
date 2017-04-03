var drawManager = new DrawManager();

var flightZone = new FlightZone(drawManager, 500);

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  updateCamera();
  drawManager.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed(e) {
  if(e.keyCode == 32 && flightZone) {
    flightZone.enableFill = !flightZone.enableFill;
  }
}
