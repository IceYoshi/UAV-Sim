class DUAV extends UAV {

  constructor(id, position) {
    
    super(
      /*id:*/ id,
      /*radius:*/ Config.duav.radius,
      /*position:*/ position,
      /*color:*/ Config.duav.color,
      /*maxSpeed:*/ Config.duav.maxSpeed,
      /*collisionThreshold:*/ Config.duav.collisionThreshold,
      /*wobblingRadius:*/ Config.duav.wobblingRadius,
      /*communicationRange:*/ Config.cluster.communicationRange
    );

    this.khopca = new KHOPCA(this)
    this.parent = null;
    this.child = null;
    this.textWeightGraphics = createGraphics(
      9 * Config.duav.radius,
      3 * Config.duav.radius
    );
    this.weightStrokeColor = "black";

    this.clusterHead = null;

    this.shouldAcceptChildren = false;
    this.shouldFlock = true;
    this.ownWeight = 0;
  }

  draw(){
    let pos = this.actualPosition;
    push();
    translate(pos.x, pos.y, pos.z);
    fill(this._color);
    this.drawOwnWeight();
    sphere(this._radius);
    pop();
  }

  update(nearbyUAVs, mUAVs) {
    this.boundWithinFlightzone();

    this.khopca.run(nearbyUAVs);
    this.doOwnClustering(nearbyUAVs);
    this.doFlocking(nearbyUAVs);
    this.doFormation(mUAVs);
    this.checkForDeadLinks();
    this.doChase(mUAVs);

    // Must be called last
    super.update(nearbyUAVs, mUAVs);
  }

  doFormation(mUAVs) {
    if(this.isClusterHead()) {
      this.clusterHead.doFormation(mUAVs);
    }
  }

  drawOwnWeight(){
    this.textWeightGraphics.background(this._color);
    this.textWeightGraphics.stroke(this.weightStrokeColor);
    this.textWeightGraphics.text(`${this.ownWeight}         ${this.ownWeight}         ${this.ownWeight}`, this.radius, 2 * this.radius);
    texture(this.textWeightGraphics);
  }

  doChase(mUAVs) {
    if(chasing && this.isClusterHead()) {
      this.clusterHead.doChase(mUAVs);
    }
  }

  boundWithinFlightzone(){
    let pos = this.anchorPosition;
    let cx = constrain(pos.x, -flightZoneSize, flightZoneSize);
    let cy = constrain(pos.y, -flightZoneSize, flightZoneSize);
    let cz = constrain(pos.z, -flightZoneSize, flightZoneSize);
    this.anchorPosition.add(cx - pos.x, cy - pos.y, cz - pos.z);
  }

  drawCluster(){
    if(this.isClusterHead())  this.clusterHead.draw();
  }

  isClusterHead(){
    return this.clusterHead != null;
  }

  calculateMeanPosition(neighbors){
    let sum = createVector(0,0,0);
    for(let i=0; i<neighbors.length; ++i){
      sum.add(neighbors[i].actualPosition);
    }
    return sum.div(neighbors.length);
  }

  doFlocking(neighbors){
    if(this.shouldFlock){
      this.moveTo(this.calculateMeanPosition(neighbors), 0.5);
    }
  }

  doOwnClustering(neighbors){
    if(!this.isClusterHead()){
        if(!this.parent){
          let possibleConnections = neighbors.filter(uav => uav.shouldAcceptChildren)
                                              .sort((uav1, uav2) => this.distanceTo(uav2) - this.distanceTo(uav1));
          if(possibleConnections.length>0){
            let uav = possibleConnections[0];
            if(uav.childDidAskForConnection(this))  uav.appendChild(this);
          }
        }
    }
  }

  appendChild(uav){
      if(this.isClusterHead())  this.clusterHead.appendChild(uav);
      else{
        this.child = uav;
        uav.parent = this;
        uav.ownWeight = this.ownWeight+1;
        uav.shouldFlock = false;
        this.shouldAcceptChildren = uav.shouldAcceptChildren = false;
        uav._color = this._color;
        this.didGetNewChild(uav);
      }
  }

  startAcceptingNewLeaf(){
    if(this.child){
      this.child.startAcceptingNewLeaf();
      this.shouldAcceptChildren = false;
    }
    else{ // leaf
      this.shouldAcceptChildren = true;
    }
  }

  stopAcceptingNewLeaf(){
    if(this.child){
      this.child.stopAcceptingNewLeaf();
    }
    this.shouldAcceptChildren = false;
  }

  didGetNewChild(child){
    if(this.isClusterHead()){
      this.clusterHead.didGetNewChild(child);
    } else if(this.parent){
      this.parent.didGetNewChild(this);
    }
  }

  checkForDeadLinks(){
    if(this.isClusterHead()) {
      this.clusterHead.checkForDeadLinks();
    } else if(this.child){
      if(this.distanceTo(this.child) > this._communicationRange){
        this.removeChild();
      }
    }
  }

  removeChild(){
    if(this.child){
      let child = this.child;
      this.child.didBecomeDUAV();
      this.child = null;
      this.didLoseChild(child, this.ownWeight);
    }
  }

  removeChildAt(weight) {
    if(this.ownWeight == weight) {
      this.didBecomeDUAV();
    } else if(this.child) {
      this.child.removeChildAt(weight);
    }
  }

  didLoseChild(child, weight) {
    if(this.isClusterHead()) {
      this.clusterHead.didLoseChild(child, weight);
    } else{
      this.parent.didLoseChild(this, weight);
    }
  }

  didBecomeClusterHead(neighbors){
    this.clusterHead = new ClusterHead(this);
    this.weightStrokeColor = "white";
  }

  didBecomeDUAV(){
    if(this.isClusterHead()){
      this.clusterHead.willBecomeDUAV();
      this.clusterHead = null;
    }
    this.ownWeight = 0;
    this.shouldAcceptChildren = false;
    this.shouldFlock = true;
    this._color = Config.duav.color;
    if(this.parent) {
      this.parent.child = null;
    }
    this.parent = null;
    if(this.child) this.child.didBecomeDUAV();
    this.child = null;
    this.weightStrokeColor = "black";
  }

  childDidAskForConnection(child){
    if(this.isClusterHead()) return this.clusterHead.childDidAskForConnection(child);
    return this.shouldAcceptChildren;
  }

}
