class UAVCluster {

  constructor(count, flightZoneSize, muav) {
    this._uavs = [muav];
    let uav_radius = 10;
    for(var i = 0; i < count; i++) {
      this._uavs.push(new DUAV(i, uav_radius, createVector(-flightZoneSize/2,
                                                          random(-flightZoneSize/2, flightZoneSize/2),
                                                          random(-flightZoneSize/2, flightZoneSize/2)
                                                        )));
    }
  }

  draw() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].draw();
    }
    this.drawConnections();
  }

  update() {
    for(let i = 0; i < this._uavs.length; i++) {
      this._uavs[i].update(this._uavs.filter(uav => uav != this._uavs[i] && !(uav instanceof MUAV)));
    }
  }

  drawConnections(){
    beginShape(LINES);
    fill(0);  stroke(1);
    for(let i = 0; i < this._uavs.length; ++i) {
        let current_uav = this._uavs[i];
        if(current_uav.links.length>0){
          let neighbor = current_uav.links[0];
          push();
          let pos1 = current_uav.actualPosition;
          let pos2 = neighbor.actualPosition;
          vertex(pos1.x, pos1.y, pos1.z);
          vertex(pos2.x, pos2.y, pos2.z);
          pop();
        }
    }
    endShape();
  }
}
