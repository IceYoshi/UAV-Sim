class UAVCluster {

  constructor(count, flightZoneSize, muav) {
    this._uavs = [muav];
    let uav_radius = 10;
    for(var i = 0; i < count; i++) {
      this._uavs.push(new DUAV(uav_radius, createVector(-flightZoneSize/2,
                                              random(-flightZoneSize/2, flightZoneSize/2),
                                              random(-flightZoneSize/2, flightZoneSize/2))));
    }
  }

  draw() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].draw();
    }
  }

  update() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].update(this._uavs.filter(uav => uav != this._uavs[i]));
    }
  }

}
