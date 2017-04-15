class UAVCluster {

  constructor(count, flightZoneSize, muav) {
    this._duavs = [];
    this._muavs = [muav];
    let uav_radius = 10;
    for(var i = 0; i < count; i++) {
      this._duavs.push(new DUAV(i, uav_radius, createVector(random(-flightZoneSize/2, flightZoneSize/2),
                                                          random(-flightZoneSize/2, flightZoneSize/2),
                                                          random(-flightZoneSize/2, flightZoneSize/2)
                                                        )));
    }
    this._uavs = this._duavs.concat(this._muavs);
  }

  draw() {
    for(let i = 0; i < this._duavs.length; i++) {
      this._duavs[i].draw();
    }
    for(let i = 0; i < this._muavs.length; i++) {
      this._muavs[i].draw();
    }
    this.drawLinks();
  }

  update() {
    for(let i = 0; i < this._duavs.length; i++) {
      this._duavs[i].update(this._duavs.filter(uav => uav != this._duavs[i]));
    }
    for(let i = 0; i < this._muavs.length; i++) {
      this._muavs[i].update(this._uavs.filter(uav => uav != this._uavs[i]));
    }
  }

  drawLinks(){
    beginShape(LINES);
    fill(0);  stroke(1);
    for(var i = 0; i < this._duavs.length; ++i) {
        var current_uav = this._duavs[i];
          for(var j=0; j<current_uav.links.length; ++j){
            var current_link_uav = current_uav.links[j];
            push();
            let pos1 = current_uav.actualPosition;
            let pos2 = current_link_uav.actualPosition;
            vertex(pos1.x, pos1.y, pos1.z);
            vertex(pos2.x, pos2.y, pos2.z);
            pop();
          }
    }
    endShape();
  }
}
