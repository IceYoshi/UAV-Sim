class UAVCluster {

  constructor(count, muav) {
    this._duavs = [];
    this._muavs = [muav];
    let uav_radius = 10;
    for(var i = 0; i < count; i++) {
      this._duavs.push(new DUAV(i, 1, uav_radius, createVector(random(-flightZoneSize/2, flightZoneSize/2),
                                              random(-flightZoneSize/2, flightZoneSize/2),
                                              flightZoneSize/2)));

    }
    this._uavs = this._duavs.concat(this._muavs);
  }

  draw() {
    for(let i = 0; i < this._duavs.length; i++) {
     this._duavs[i].draw();
    }
    this.drawLinks();
  }

  update() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].update(this._uavs.filter(uav =>
        uav != this._uavs[i] && !(uav instanceof MUAV) && uav.distanceTo(this._uavs[i]) <= this._uavs[i].communicationRange
      ), this._muavs);
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
}
