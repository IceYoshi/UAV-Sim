class UAVCluster {

  constructor(count, flightZoneSize) {
    this._uavs = [];
    let uav_radius = 10;

    for(var i = 0; i < count; i++) {
      this._uavs.push(new DUAV(uav_radius, createVector(-flightZoneSize/2,
                                              random(-flightZoneSize/2, flightZoneSize/2),
                                              random(-flightZoneSize/2, flightZoneSize/2))));
    }
  }

  draw() {
    for(let i = 0; i < this._uavs.length; ++i) {
      this._uavs[i].draw();
    }
  }

  update() {
    for(let i = 0; i < this._uavs.length; ++i) {
      if(typeof this._uavs[i].update === 'function') {
        this._uavs[i].update();
      }
    }
  }


}
