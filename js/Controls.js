var controls;

// Global simulation settings
var paused = !Config.simulation.updateEnabled;
var wobbling = Config.simulation.wobblingEnabled;
var separation = Config.simulation.separationEnabled;
var chasing = Config.simulation.chasingEnabled;
var formation = Config.simulation.formationEnabled;
var autoRestart = Config.simulation.restartEnabled;
//var shouldLogSimulation = false;

// DOM objects
//var velocitySlider;
//var settingsInfo;
//var cameraControlEnabled = true; // Blocks camera rotating while on top of a slider
var updateCount = 0;

class Controls {

  constructor(){
    this._keyBindings = {};

    this._keyBindings[' '] = this.pauseToggle.bind(this);
    this._keyBindings['a'] = this.autoRestartToggle.bind(this);
    this._keyBindings['c'] = this.chaseToggle.bind(this);
    this._keyBindings['f'] = this.formationToggle.bind(this);
    this._keyBindings['p'] = this.performParameterTest.bind(this);
    this._keyBindings['r'] = this.resetCanvas.bind(this);
    this._keyBindings['s'] = this.separationToggle.bind(this);
    this._keyBindings['w'] = this.wobblingToggle.bind(this);
  }

  muavIsOutsideFlightZone() {
    if(this._parameterTest != undefined) {
      if(!this._parameterTest.nextRun(updateCount)) {
        this._parameterTest = null;
      }
    } else if(autoRestart) {
      this.resetCanvas();
    }
  }

  keyPressed(keyCode) {
    let callback = this._keyBindings[String.fromCharCode(keyCode).toLowerCase()];
    if(callback && typeof callback === "function") {
      callback();
    }
  }

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

  resetCanvas() {
    drawManager.stop();
    drawManager = new DrawManager();
    drawManager.initializeObjects();
    updateCount = 0;
  }

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
      updateCount = -1;
      this.muavIsOutsideFlightZone();
    }
  }

}

function keyPressed(e) {
  controls.keyPressed(e.keyCode);
}
