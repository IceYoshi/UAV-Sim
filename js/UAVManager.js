class UAVManager {

  constructor() {
    this._duavs = [];
    this._muavs = [new MUAV()];
    for(var i = 0; i < Config.flightZone.numOfDUAV; i++) {
      this._duavs.push(new DUAV(
        /*id:*/ i,
        /*position:*/ createVector(random(-Config.flightZone.size/2, Config.flightZone.size/2),
                                   random(-Config.flightZone.size/2, Config.flightZone.size/2),
                                   Config.flightZone.size/2)
      ));
    }
    this._uavs = this._duavs.concat(this._muavs);
  }

  draw() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].draw();
    }
    this.drawLinks();
  }

  update() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].update(this._uavs.filter(uav =>
        uav != this._uavs[i] && !(uav instanceof MUAV) && uav.distanceTo(this._uavs[i]) <= this._uavs[i].communicationRange
      ), this._muavs);
    }

    if(this.muavIsOutsideFlightZone()) {
      controls.muavIsOutsideFlightZone();
    }
  }

  drawLinks(){
    beginShape(LINES);
    fill(0);  stroke(1);
    for(let i = 0; i < this._duavs.length; ++i) {
        let current_duav = this._duavs[i];
        current_duav.drawCluster();
    }
    endShape();
  }

  muavIsOutsideFlightZone() {
    let muav = this._muavs[0];
    let border = Config.flightZone.size/2;
    if(Math.abs(muav.actualPosition.x) > border
      || Math.abs(muav.actualPosition.y) > border
      || Math.abs(muav.actualPosition.z) > border) {
      return true;
    }
    return false;
  }

}
