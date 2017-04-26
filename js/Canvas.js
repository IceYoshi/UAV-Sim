var drawManager = new DrawManager();

// Global simulation settings
var flightZoneSize = 500;
var wobbling = true;
var collision = true;
var chasing = false;

// DOM objects
var velocitySlider;
var settingsInfo;
var cameraControlEnabled = true

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noiseDetail(8, 0.3);

  initializeObjects();
  initializeDOM();
}

function initializeDOM() {
  let padding = 10

  velocitySlider = createSlider(1, 5, 1, 1);
  velocitySlider.style(`position: absolute; bottom: ${padding}; left: ${padding};`);
  velocitySlider.attribute('onmouseenter', 'cameraControlEnabled = false;');
  velocitySlider.attribute('onmouseleave', 'cameraControlEnabled = true;');
  velocitySlider.attribute('oninput', 'updateSettingsInfo();');

  settingsInfo = createDiv();
  settingsInfo.style(`position: absolute; bottom: ${padding}; left: ${2 * padding + velocitySlider.width};`);

  updateSettingsInfo();
}

function initializeObjects() {
  drawManager.add(new FlightZone());
  drawManager.add(new UAVCluster(50, new MUAV(null, 10)));
}

function draw() {
  updateCamera();
  background(UAVColor.FLIGHTZONE);
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
    case 65: // Key: a
      // Toggle UAV collision avoidance
      collision = !collision;
      break;
    case 67: // Key: c
      // Toggle chasing phase
      chasing = !chasing;
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
  settingsInfo.html(`x${velocitySlider.value() || 1} update frequency | Click '<b>R</b>' for reset | Updates (<b>spacebar</b>): ${!drawManager.paused} | <b>W</b>obbling: ${wobbling} | <b>A</b>void collisions: ${collision} | <b>C</b>hasing: ${chasing}`);
}
