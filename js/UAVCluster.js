class UAVCluster {

  constructor(count, flightZoneSize, muav) {
    this._uavs = [muav];
    let uav_radius = 10;
    this._uavs.push(new DUAV(0, uav_radius, createVector(-flightZoneSize/2,
                                            random(-flightZoneSize/2, flightZoneSize/2),
                                            random(-flightZoneSize/2, flightZoneSize/2)), true));
    for(var i = 1; i < count; i++) {
      this._uavs.push(new DUAV(i, uav_radius, createVector(-flightZoneSize/2,
                                              random(-flightZoneSize/2, flightZoneSize/2),
                                              random(-flightZoneSize/2, flightZoneSize/2)), false));
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
