var drawManager = new DrawManager();
var settingsInfo;
var wobbling = true;
var collision = true;

/*var uavTexture = null;
function preload() {
  uavTexture = loadImage("./assets/wheatley.png");
}*/

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noiseDetail(8, 0.3);

  initializeObjects();
  initializeDOM();
}

function initializeDOM() {
  settingsInfo = createDiv();
  settingsInfo.style("position: absolute; bottom: 10; left: 10;");
  updateSettingsInfo();
}

function initializeObjects() {
  let flightZoneSize = 500;

  drawManager.add(new FlightZone(flightZoneSize));
  drawManager.add(new UAVCluster(25, flightZoneSize, new MUAV(10)));
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
  //print(e.keyCode);
  switch (e.keyCode) {
    case 32: // Key: Space bar
      // Pause object updates. Draw calls are unaffected
      drawManager.paused = !drawManager.paused;
      break;
    case 67: // Key: c
      // Toggle UAV collision avoidance
      collision = !collision;
      break;
    case 82: // Key: r
      // Reset canvas
      let paused = drawManager.paused;
      drawManager = new DrawManager();
      drawManager.paused = paused;
      initializeObjects();
      break;
    case 87: // Key: w
      // Toggle UAV wobbling
      wobbling = !wobbling;
      break;
  }
  updateSettingsInfo();
}

function updateSettingsInfo() {
  settingsInfo.html(`Click '<b>R</b>' for reset | Updates (<b>spacebar</b>): ${!drawManager.paused} | <b>W</b>obbling: ${wobbling} | <b>C</b>ollisions: ${collision}`);
}
