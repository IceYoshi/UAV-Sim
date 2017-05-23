var controls;

// Global simulation settings
var paused = !Config.simulation.updateEnabled;
var wobbling = Config.simulation.wobblingEnabled;
var separation = Config.simulation.separationEnabled;
var chasing = Config.simulation.chasingEnabled;
var formation = Config.simulation.formationEnabled;
var autoRestart = Config.simulation.restartEnabled;
<<<<<<< HEAD
var formationEnclosement = Config.simulation.formationEnclosement;
var updateCount = 0;
=======
var shouldLogSimulation = false;

// DOM objects
var velocitySlider;
var settingsInfo;
var cameraControlEnabled = true; // Blocks camera rotating while on top of a slider
var simulationData = "";
var updateCount = 0;
var numOfSimulations = 0;
>>>>>>> origin/dren-dev

class Controls {

  constructor(){
    this._keyBindings = {};

    this._keyBindings[' '] = this.pauseToggle.bind(this);
    this._keyBindings['a'] = this.autoRestartToggle.bind(this);
    this._keyBindings['c'] = this.chaseToggle.bind(this);
<<<<<<< HEAD
    this._keyBindings['f'] = this.formationToggle.bind(this);
    this._keyBindings['p'] = this.performParameterTest.bind(this);
=======
    this._keyBindings['d'] = this.downloadSimulationData.bind(this);
    this._keyBindings['f'] = this.formationToggle.bind(this);
    this._keyBindings['p'] = this.performSimulation.bind(this);
>>>>>>> origin/dren-dev
    this._keyBindings['r'] = this.resetCanvas.bind(this);
    this._keyBindings['s'] = this.separationToggle.bind(this);
    this._keyBindings['w'] = this.wobblingToggle.bind(this);
  }

  muavIsOutsideFlightZone() {
<<<<<<< HEAD
    if(this._parameterTest != undefined) {
      if(!this._parameterTest.nextRun(updateCount)) {
        this._parameterTest = null;
      }
=======
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
>>>>>>> origin/dren-dev
    } else if(autoRestart) {
      this.resetCanvas();
    }
  }

<<<<<<< HEAD
=======
  changeConfig() {
    if(numOfSimulations >= 3) {
      Config.flightZone.numOfDUAV += 10;
      numOfSimulations = 0;
    }

    if(Config.flightZone.numOfDUAV >= 30) {
      this.downloadSimulationData();
    }
  }

>>>>>>> origin/dren-dev
  keyPressed(keyCode) {
    let callback = this._keyBindings[String.fromCharCode(keyCode).toLowerCase()];
    if(callback && typeof callback === "function") {
      callback();
    }
  }

<<<<<<< HEAD
  pauseToggle(value) {
    // Pauses object updates. Draw calls are unaffected
    paused = value == undefined ? !paused : value;
    $("#chbUpdate").prop("checked", !paused);
  }

  separationToggle(value) {
    separation = value == undefined ? !separation : value;
    $("#chbCollisions").prop("checked", separation);
  }

  chaseToggle(value) {
    chasing = value == undefined ? !chasing : value;
    $("#chbChasing").prop("checked", chasing);
  }

  performParameterTest() {
    if(this._parameterTest == undefined) {
      this._parameterTest = new ParameterTest();
    }
  }

  formationToggle(value) {
    formation = value == undefined ? !formation : value;
    $("#chbFormation").prop("checked", formation);
  }

  formationEnclosementToggle(value) {
    formationEnclosement = value == undefined ? !formationEnclosement : value;
    $("#chbFormationEnclosement").prop("checked", formationEnclosement);
=======
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
>>>>>>> origin/dren-dev
  }

  resetCanvas() {
    drawManager.stop();
    drawManager = new DrawManager();
    drawManager.initializeObjects();
    updateCount = 0;
  }

<<<<<<< HEAD
  wobblingToggle(value) {
    wobbling = value == undefined ? !wobbling : value;
    $("#chbWobbling").prop("checked", wobbling);
  }

  autoRestartToggle(value) {
    autoRestart = value == undefined ? !autoRestart : value;
    $("#chbAutoRestart").prop("checked", autoRestart);
  }

  setNumOfUAVs(value) {
    Config.simulation.numOfUAVs = value;
    $("#nrOfUavsSlider").slider("value", value);
    $("#lblCurrentSliderNrOfUavs").text(value);
  }

  setCommunicationRange(value) {
    Config.cluster.communicationRange = value;
    $("#communicationRangeSliderDUAV").slider("value", value);
    $("#lblCurrentCommunicationRangeDUAV").text(value);
  }

  setDUAVWobblingRadius(value) {
    Config.duav.wobblingRadius = value;
    $("#wobblingRadiusSliderDUAV").slider("value", value);
    $("#lblCurrentWobblingRadiusDUAV").text(value);
  }

  setMUAVWobblingRadius(value) {
    Config.muav.wobblingRadius = value;
    $("#wobblingRadiusSliderMUAV").slider("value", value);
    $("#lblCurrentWobblingRadiusMUAV").text(value);
  }

  setDUAVCollisionThreshold(value) {
    Config.duav.collisionThreshold = value;
    $("#collisionThresholdSliderDUAV").slider("value", value);
    $("#lblCurrentCollisionThresholdDUAV").text(value);
  }

  setMUAVCollisionThreshold(value) {
    Config.muav.collisionThreshold = value;
    $("#collisionThresholdSliderMUAV").slider("value", value);
    $("#lblCurrentCollisionThresholdMUAV").text(value);
  }

  setUpdateFrequency(value) {
    Config.simulation.update = value;
    velocitySlider.slider("value", value);
    $("#lblVelocitySliderValue").text("(x" + value + ")");
  }

  setNumOfBranches(value) {
    Config.cluster.numOfBranches = value;
    $("#numOfBranchesCHSlider").slider("value", value);
    $("#lblCurrentNumOfBranchesCH").text(Config.cluster.numOfBranches);
  }

  incrementUpdateCount() {
    updateCount++;
    if(updateCount >= Config.simulation.failedThreshold && this._parameterTest != undefined) {
      //updateCount = -1;
      this.muavIsOutsideFlightZone();
    }
  }

}

function keyPressed(e) {
  controls.keyPressed(e.keyCode);
=======
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
>>>>>>> origin/dren-dev
}
