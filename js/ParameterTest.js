class ParameterTest {

  constructor(numOfRuns) {
    this._numOfRuns = numOfRuns || 1;
    this._parameterPicker = 0;
    this._jumpTo = 4;
    this._currentRunCount = 1;
    this._runLog = 'sep=,\n' +
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
                    ',numOfClusters' +
                    ',numOfLonelyUAVs' +
                    ',timePassed';
    this.initializeParameters();
  }

  initializeParameters() {
    controls.setNumOfUAVs(10);
    controls.setCommunicationRange(100);
    controls.setDUAVWobblingRadius(50);
    controls.setMUAVWobblingRadius(150);
    controls.setDUAVCollisionThreshold(40);
    controls.setMUAVCollisionThreshold(60);
    controls.setNumOfBranches(3);

    controls.setUpdateFrequency(Config.simulation.maxUpdate);
    controls.pauseToggle(false);
    controls.autoRestartToggle(true);
    controls.wobblingToggle(true);
    controls.separationToggle(true);
    controls.chaseToggle(true);
    controls.formationToggle(true);

    controls.resetCanvas();
  }

  moveToNextParameter() {
    this.initializeParameters();
    this._parameterPicker++;
  }

  logRun(updateCount) {
    this._runLog += `\n${Config.flightZone.size.width}` +
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
                      `,${setupDelegate.getNumOfClusters()}` +
                      `,${setupDelegate.getNumOfLonelyUAVs()}` +
                      `,${updateCount}`;
  }

  nextRun(updateCount) {
    this.logRun(updateCount);

    controls.resetCanvas();
    this._currentRunCount++;
    if(this._currentRunCount > Config.simulation.runCount) {
      this._currentRunCount = 1;
      if(this._parameterPicker == 0) {
        if(Config.simulation.numOfUAVs < 100 && this._jumpTo == 0) {
          controls.setNumOfUAVs(Config.simulation.numOfUAVs + 10);
          print(Config.simulation.numOfUAVs + "/" + 100);
        } else {
          this.moveToNextParameter();
          controls.setNumOfUAVs(20);
          controls.setCommunicationRange(0);
        }
      }

      if(this._parameterPicker == 1) {
        if(Config.cluster.communicationRange < 500 && this._jumpTo == 1) {
          controls.setCommunicationRange(Config.cluster.communicationRange + 100);
          print(Config.cluster.communicationRange + "/" + 500);
        } else {
          this.moveToNextParameter();
          controls.setNumOfUAVs(20);
          controls.setDUAVWobblingRadius(0);
        }
      }

      if(this._parameterPicker == 2) {
        if(Config.duav.wobblingRadius < 500 && this._jumpTo == 2) {
          controls.setDUAVWobblingRadius(Config.duav.wobblingRadius + 100);
          print(Config.duav.wobblingRadius + "/" + 500);
        } else {
          this.moveToNextParameter();
          controls.setNumOfUAVs(20);
          controls.setMUAVWobblingRadius(0);
        }
      }

      if(this._parameterPicker == 3) {
        if(Config.muav.wobblingRadius < 500 && this._jumpTo == 3) {
          controls.setMUAVWobblingRadius(Config.muav.wobblingRadius + 100);
          print(Config.muav.wobblingRadius + "/" + 500);
        } else {
          this.moveToNextParameter();
          controls.setNumOfUAVs(20);
          controls.setDUAVCollisionThreshold(0);
        }
      }

      if(this._parameterPicker == 4) {
        if(Config.duav.collisionThreshold < 100 && this._jumpTo == 4) {
          controls.setDUAVCollisionThreshold(Config.duav.collisionThreshold + 10);
          print(Config.duav.collisionThreshold + "/" + 100);
        } else {
          this.moveToNextParameter();
          controls.setNumOfUAVs(20);
          controls.setMUAVCollisionThreshold(0);
        }
      }

      if(this._parameterPicker == 5) {
        if(Config.muav.collisionThreshold < 100 && this._jumpTo == 5) {
          controls.setMUAVCollisionThreshold(Config.muav.collisionThreshold + 10);
          print(Config.muav.collisionThreshold + "/" + 100);
        } else {
          this.moveToNextParameter();
          controls.setNumOfUAVs(20);
          controls.setNumOfBranches(0);
        }
      }

      if(this._parameterPicker == 6) {
        if(Config.cluster.numOfBranches < 10 && this._jumpTo == 6) {
          controls.setNumOfBranches(Config.cluster.numOfBranches + 1);
          print(Config.cluster.numOfBranches + "/" + 10);
        } else {
          this.moveToNextParameter();
        }
      }

      if(this._parameterPicker > 6) {
        this.downloadProgress();
        controls.pauseToggle(true);
        return false;
      }

    }

    return true;

  }

  downloadProgress() {
    download('output.csv', this._runLog);
  }

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
