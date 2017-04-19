class UAVCluster {

  constructor(count, flightZoneSize, muav, communicationRange) {
    this._communicationRange = communicationRange || 0;
    this._duavs = [];
    this._muavs = [muav];
    let uav_radius = 10;
    for(var i = 0; i < count; i++) {
      this._duavs.push(new DUAV(i, uav_radius, createVector(-flightZoneSize/2,
                                              random(-flightZoneSize/2, flightZoneSize/2),
                                              random(-flightZoneSize/2, flightZoneSize/2))));
    }
    this._uavs = this._duavs.concat(this._muavs);
  }

  draw() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].draw();
    }
  }

  update() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].update(this._uavs.filter(uav =>
        uav != this._uavs[i] && !(uav instanceof MUAV) && uav.distanceTo(this._uavs[i]) <= this._communicationRange
      ), this._muavs);
    }
  }

}
