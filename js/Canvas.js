var drawManager = new DrawManager();

/*var uavTexture = null;
function preload() {
  uavTexture = loadImage("./assets/wheatley.png");
}*/

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noiseDetail(8, 0.3);

  initializeObjects();
}

function initializeObjects() {
  let flightZoneSize = 500;

  drawManager.add(new FlightZone(flightZoneSize));
  drawManager.add(new UAVCluster(20, flightZoneSize));
  drawManager.add(new MUAV(10));
}

function draw() {
  updateCamera();
  background("#e7e7e7");
  drawManager.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed(e) {
  switch (e.keyCode) {
    case 32: // Key: Space bar
      // Pause object updates. Draw calls are unaffected
      drawManager.paused = !drawManager.paused;
      break;
    case 82: // Key: r
      // Reset canvas
      let paused = drawManager.paused;
      drawManager = new DrawManager();
      drawManager.paused = paused;
      initializeObjects();
      break;
  }
}
