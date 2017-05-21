var controls;

// Global simulation settings
var paused = !Config.simulation.updateEnabled;
var wobbling = Config.simulation.wobblingEnabled;
var separation = Config.simulation.separationEnabled;
var chasing = Config.simulation.chasingEnabled;
var formation = Config.simulation.formationEnabled;
var autoRestart = Config.simulation.restartEnabled;
var shouldLogSimulation = false;

// DOM objects
var velocitySlider;
var settingsInfo;
var cameraControlEnabled = true; // Blocks camera rotating while on top of a slider
var simulationData = "";
var updateCount = 0;
var numOfSimulations = 0;

class Controls {

  constructor(){
    this._keyBindings = {};

    this._keyBindings[' '] = this.pauseToggle.bind(this);
    this._keyBindings['a'] = this.autoRestartToggle.bind(this);
    this._keyBindings['c'] = this.chaseToggle.bind(this);
    this._keyBindings['d'] = this.downloadSimulationData.bind(this);
    this._keyBindings['f'] = this.formationToggle.bind(this);
    this._keyBindings['p'] = this.performSimulation.bind(this);
    this._keyBindings['r'] = this.resetCanvas.bind(this);
    this._keyBindings['s'] = this.separationToggle.bind(this);
    this._keyBindings['w'] = this.wobblingToggle.bind(this);
  }

  muavIsOutsideFlightZone() {
    print("Test");
    if(shouldLogSimulation) {
      numOfSimulations++;
      simulationData += `\n${Config.flightZone.size}` +
                        `,${Config.flightZone.numOfDUAV}` +
                        `,${Config.cluster.communicationRange}` +
                        `,${Config.cluster.numOfBranches}` +
                        `,${Config.duav.radius}` +
                        `,${Config.duav.maxSpeed}` +
                        `,${Config.duav.collisionThreshold}` +
                        `,${Config.duav.wobblingRadius}` +
                        `,${Config.muav.radius}` +
                        `,${Config.muav.maxSpeed}` +
                        `,${Config.muav.collisionThreshold}` +
                        `,${Config.muav.wobblingRadius}` +
                        `,${updateCount}`;
      this.changeConfig();
      this.resetCanvas();
    } else if(autoRestart) {
      this.resetCanvas();
    }
  }

  changeConfig() {
    if(numOfSimulations >= 3) {
      Config.flightZone.numOfDUAV += 10;
      numOfSimulations = 0;
    }

    if(Config.flightZone.numOfDUAV >= 30) {
      this.downloadSimulationData();
    }
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
    $("#chbUpdate").prop("checked", !paused);
  }

  separationToggle() {
    separation = !separation;
    $("#chbCollisions").prop("checked", separation);
  }

  chaseToggle() {
    chasing = !chasing;
    $("#chbChasing").prop("checked", chasing);
  }

  performSimulation() {
    if(!shouldLogSimulation) {
      simulationData = 'sep=,\n' +
                      'flightZoneSize' +
                      ',numOfDUAV' +
                      ',communicationRange' +
                      ',numOfBranches' +
                      ',duavRadius' +
                      ',duavMaxSpeed' +
                      ',duavCollisionThreshold' +
                      ',duavWobblingRadius' +
                      ',muavRadius' +
                      ',muavMaxSpeed' +
                      ',muavCollisionThreshold' +
                      ',muavWobblingRadius' +
                      ',timePassed';
      chasing = true;
      formation = true;
      shouldLogSimulation = true;

      velocitySlider.slider("value", Config.simulation.maxUpdate);
      updateSettingsInfo();
      this.resetCanvas();
    }
  }

  downloadSimulationData() {
    if(shouldLogSimulation) {
      download('output.csv', simulationData);
      shouldLogSimulation = false;
      paused = true;
      updateSettingsInfo();
    }
  }

  formationToggle() {
    formation = !formation;
    $("#chbFormation").prop("checked", formation);
  }

  resetCanvas() {
    drawManager.stop();
    drawManager = new DrawManager();
    drawManager.initializeObjects();
    updateCount = 0;
  }

  wobblingToggle() {
    wobbling = !wobbling;
    $("#chbWobbling").prop("checked", wobbling);
  }

  autoRestartToggle() {
    autoRestart = !autoRestart;
    $("#chbAutoRestart").prop("checked", autoRestart);
  }

}

function keyPressed(e) {
  controls.keyPressed(e.keyCode);
  updateSettingsInfo();
}

function updateSettingsInfo() {

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
