var controls;

// Global simulation settings
var paused = false;
var wobbling = true;
var separation = true;
var chasing = false;
var formation = false;
var autoRestart = true;

// DOM objects
var velocitySlider;
var settingsInfo;
var cameraControlEnabled = true;

class Controls {

  constructor(){
    this._keyBindings = {};

    this._keyBindings[' '] = this.pauseToggle.bind(this);
    this._keyBindings['a'] = this.autoRestartToggle.bind(this);
    this._keyBindings['c'] = this.chaseToggle.bind(this);
    this._keyBindings['d'] = this.performSimulation.bind(this);
    this._keyBindings['f'] = this.formationToggle.bind(this);
    this._keyBindings['r'] = this.resetCanvas.bind(this);
    this._keyBindings['s'] = this.separationToggle.bind(this);
    this._keyBindings['w'] = this.wobblingToggle.bind(this);

    this.initializeDOM();
  }

  initializeDOM() {
    let padding = 10;

    velocitySlider = createSlider(1, 10, 1, 1);
    velocitySlider.style(`position: absolute; bottom: ${padding}; left: ${padding};`);
    velocitySlider.attribute('onmouseenter', 'cameraControlEnabled = false;');
    velocitySlider.attribute('onmouseleave', 'cameraControlEnabled = true;');
    velocitySlider.attribute('oninput', 'updateSettingsInfo();');

    settingsInfo = createDiv();
    settingsInfo.style(`position: absolute; bottom: ${padding}; left: ${2 * padding + velocitySlider.width};`);

    updateSettingsInfo();
  }

  muavIsOutsideFlightZone() {
    if(autoRestart) this.resetCanvas();
  }

  keyPressed(keyCode) {
    let callback = this._keyBindings[String.fromCharCode(keyCode).toLowerCase()];
    if(callback && typeof callback === "function") {
      callback();
    }
  }

  pauseToggle() {
    // Pauses object updates. Draw calls are unaffected
    paused = !paused;
  }

  separationToggle() {
    separation = !separation;
  }

  chaseToggle() {
    chasing = !chasing;
  }

  performSimulation() {
    download('output.csv', 'sep=,\nH1,H2\n50,20');
  }

  formationToggle() {
    formation = !formation;
  }

  resetCanvas() {
    drawManager = new DrawManager();
    drawManager.initializeObjects();
  }

  wobblingToggle() {
    wobbling = !wobbling;
  }

  autoRestartToggle() {
    autoRestart = !autoRestart;
  }

}

function keyPressed(e) {
  controls.keyPressed(e.keyCode);
  updateSettingsInfo();
}

function updateSettingsInfo() {
  settingsInfo.html(`x${velocitySlider.value() || 1} update frequency | Click '<b>R</b>' for reset | Updates (<b>spacebar</b>): ${!paused} | <b>W</b>obbling: ${wobbling} | <b>S</b>eparation: ${separation} | <b>C</b>hasing: ${chasing} | <b>F</b>ormation: ${formation} | <b>A</b>utoRestart: ${autoRestart}`);
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
