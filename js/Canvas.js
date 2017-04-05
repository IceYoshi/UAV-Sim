var drawManager = new DrawManager();

var flightZone, cluster, muav = null;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  flightZone = new FlightZone(drawManager, 500);
  cluster = new UAVCluster(drawManager, 20);
  muav = new MUAV(drawManager, 10);
}

function draw() {
  updateCamera();
  drawManager.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed(e) {
  if(e.keyCode == 32) { // Space bar click
    // Pause object updates. Draw calls are unaffected
    drawManager.paused = !drawManager.paused;
  }
}
