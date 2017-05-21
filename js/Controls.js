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
    if(shouldLogSimulation) {
      numOfSimulations++;
      simulationData += `\n${Config.flightZone.size.width}` +
                        `,${Config.flightZone.size.height}` +
                        `,${Config.flightZone.size.depth}` +
                        `,${Config.simulation.numOfUAVs}` +
                        `,${Config.cluster.communicationRange}` +
                        `,${Config.cluster.numOfBranches}` +
                        `,${Config.duav.radius}` +
                        `,${Config.duav.speed}` +
                        `,${Config.duav.collisionThreshold}` +
                        `,${Config.duav.wobblingRadius}` +
                        `,${Config.muav.radius}` +
                        `,${Config.muav.speed}` +
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
      this.setNumOfUAVs(Config.simulation.numOfUAVs + 10);
      numOfSimulations = 0;
    }

    if(Config.simulation.numOfUAVs >= 30) {
      this.downloadSimulationData();
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

  performSimulation() {
    if(!shouldLogSimulation) {
      simulationData = 'sep=,\n' +
                      'flightZoneWidth' +
                      ',flightZoneHeight' +
                      ',flightZoneDepth' +
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
      this.chaseToggle(true);
      this.formationToggle(true);
      shouldLogSimulation = true;
      this.setNumOfUAVs(10);
      velocitySlider.slider("value", Config.simulation.maxUpdate);
      this.resetCanvas();
    }
  }

  downloadSimulationData() {
    if(shouldLogSimulation) {
      download('output.csv', simulationData);
      shouldLogSimulation = false;
      this.pauseToggle(true);
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

}

function keyPressed(e) {
  controls.keyPressed(e.keyCode);
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
