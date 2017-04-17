class UAVCluster {

  constructor(count, flightZoneSize, muav) {
    this._duavs = [];
    this._muavs = [muav];
    let uav_radius = 10;
    for(var i = 0; i < count; i++) {
      this._duavs.push(new DUAV(i, 1, uav_radius, createVector(random(-flightZoneSize/2, flightZoneSize/2),
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
/*
    let o = 0;
    let k = 0;
      for(let i = 0; i < this._duavs.length; i++) {
        let uav = this._duavs[i];
        if(uav.statemanager.getCurrentState() == UAVStateEnum.KHOPCA)
          k++;
        if(uav.statemanager.getCurrentState() == UAVStateEnum.OWN_CLUSTERING)
            o++;
      }

      console.log("k: "+k+" , o: "+o);*/

  }

  drawLinks(){
    beginShape(LINES);
    fill(0);  stroke(1);
    for(let i = 0; i < this._duavs.length; ++i) {
        let current_uav = this._duavs[i];
        if(current_uav.parent){
          let parent = current_uav.parent;
          push();
          let pos1 = current_uav.actualPosition;
          let pos2 = parent.actualPosition;
          vertex(pos1.x, pos1.y, pos1.z);
          vertex(pos2.x, pos2.y, pos2.z);
          pop();
        }
    }
    endShape();
  }
}
