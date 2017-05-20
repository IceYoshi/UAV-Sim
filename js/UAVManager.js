class UAVManager {

  constructor() {
    this._duavs = [];
    this._muavs = [new MUAV()];
    if (Config.simulation.uavPositioningPlane){
      for(var i = 0; i < Config.simulation.numOfUAVs; i++) {
        this._duavs.push(new DUAV(i, createVector(random(-flightZoneSize.width/2, flightZoneSize.width/2),
                                                random(-flightZoneSize.height/2, flightZoneSize.height/2),
                                                  flightZoneSize.depth/2)));
      }
    }
    else{
      for(var i = 0; i < Config.simulation.numOfUAVs; i++) {
        this._duavs.push(new DUAV(i, createVector(random(-flightZoneSize.width/2, flightZoneSize.width/2),
                                                random(-flightZoneSize.height/2, flightZoneSize.height/2),
                                              random(-flightZoneSize.depth/2, flightZoneSize.depth/2))));
      }
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
  }

  updateDUAVSpeed(){
    for(let i = 0; i < this._duavs.length; i++) {
      this._duavs[i].maxSpeed = Config.duav.speed;
    }
  }
  updateDUAVCollisionThreshold(){
    for(let i = 0; i < this._duavs.length; i++) {
      this._duavs[i].collisionThreshold = Config.duav.collisionThreshold;
    }
  }

  updateDUAVWobblingRadius(){
    for(let i = 0; i < this._duavs.length; i++) {
      this._duavs[i].wobblingRadius = Config.duav.wobblingRadius;
    }
  }

  updateDUAVCommunicationRange(){
    for(let i = 0; i < this._duavs.length; i++) {
      this._duavs[i].communicationRange = Config.cluster.communicationRange;
    }
  }

  updateMUAVSpeed(){
    for(let i = 0; i < this._muavs.length; i++) {
      this._muavs[i].maxSpeed = Config.muav.speed;
    }
  }
  updateMUAVCollisionThreshold(){
    for(let i = 0; i < this._muavs.length; i++) {
      this._muavs[i].collisionThreshold = Config.muav.collisionThreshold;
    }
  }

  updateMUAVWobblingRadius(){
    for(let i = 0; i < this._muavs.length; i++) {
      this._muavs[i].wobblingRadius = Config.muav.wobblingRadius;
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
