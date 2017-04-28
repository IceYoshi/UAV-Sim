class DUAV extends UAV {

  constructor(id, radius, position) {
    super(
      /*id:*/ id,
      /*radius:*/ radius,
      /*position:*/ position,
      /*color:*/ UAVColor.DUAV,
      /*maxSpeed:*/ 0.8,
      /*collisionThreshold:*/ 40,
      /*wobblingRadius:*/ 50,
      /*communicationRange:*/ 100
    );
    this.khopca = new KHOPCA(this)
    this.parent = null;
    this.child = null;
    this.textWeightGraphics = createGraphics(9*radius,3*radius);

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
    this.checkForDeadLinks();
    this.doChase(mUAVs);

    // Must be called last
    super.update(nearbyUAVs, mUAVs);
  }

  drawOwnWeight(){
    this.textWeightGraphics.background(this._color);
    this.textWeightGraphics.stroke(this.weightStrokeColor);
    this.textWeightGraphics.text(`${this.ownWeight}         ${this.ownWeight}         ${this.ownWeight}`, this.radius, 2 * this.radius);
    texture(this.textWeightGraphics);
  }

  doChase(mUAVs) {
    if(chasing && this.isClusterHead()) {
      if(mUAVs && mUAVs.length > 0) {
        let mUAV = mUAVs[0];
        if(this._oldPos) {
          // Predict mUAV heading
          let n = this.headingTo(mUAV.actualPosition);
          let v = mUAV.headingFrom(this._oldPos);

          let a = p5.Vector.angleBetween(n, v);

          let vProj = n.setMag(cos(a) * v.mag());

          let offsetVector = v.sub(vProj);

          this.applyForce(offsetVector, 0.5);
        }
        this.moveTo(mUAV.actualPosition);
        this._oldPos = mUAV.actualPosition;
      }
    }
  }

  boundWithinFlightzone(){
    let pos = this.anchorPosition;
    let cx = constrain(pos.x, -flightZoneSize/2, flightZoneSize/2);
    let cy = constrain(pos.y, -flightZoneSize/2, flightZoneSize/2);
    let cz = constrain(pos.z, -flightZoneSize/2, flightZoneSize/2);
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
    this._color = UAVColor.DUAV;
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

<<<<<<< HEAD
  rule1(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let rule1Neighbors = neighbors.filter(uav => uav.weight == maxW);
      let wasCH = this.isClusterHead();
      if(maxW > this.weight){
        this.weight = max([this.minWeight,maxW-1]);

        if(wasCH) this.didBecomeDUAV();
      }
    }
  }

  rule2(neighbors){
    if(this.maxWeightofNeighborhood(neighbors) == this.minWeight && this.weight == this.minWeight){
        // from here: Cluster Head!
        this.weight = this.maxWeight;
        this._color = UAVColor.CLUSTER_HEAD;
        this.didBecomeClusterHead(neighbors);
    }
  }

  rule3(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let wasCH = this.isClusterHead();
      if(maxW>this.minWeight-1 && maxW <= this.weight && this.weight != this.maxWeight){
        this.weight -= 1;
        if(wasCH) this.didBecomeDUAV();
      }
    }
  }

  rule4(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let wasCH = this.isClusterHead();

      if(maxW == this.maxWeight && this.weight == this.maxWeight){
        this.weight = random(this.weight, maxW);
        this.weight -= 1;
        if(wasCH) this.didBecomeDUAV();
      }
    }
  }

  maxWeightofNeighborhood(neighbors){
    if(neighbors.length==0) return this.minWeight-1;
    let max = neighbors[0].weight;
    for(let i=1; i<neighbors.length;++i){
      if(neighbors[i].weight > max)
        max = neighbors[i].weight;
    }
    return max;
  }

  doOwnClustering(neighbors){
    if(!this.isClusterHead()){
        if(!this.parent){
          let possibleConnections = neighbors.filter(uav => uav.shouldAcceptChildren)
                                              .sort(function(u1,u2){u2.weight-u1.weight})
                                              .sort(this.sortByDistance(this));
          if(possibleConnections.length>0){
            let uav = possibleConnections[0];
            if(uav.childDidAskForConnection(this))  uav.appendChild(this);
          }
        }
    }
  }

  sortByDistance(refUav) {
      return function(uav1, uav2) {
          return refUav.distanceTo(uav2) - refUav.distanceTo(uav1);
      }
  }

  doKhopca(neighbors){
    this.rule1(neighbors);
    this.rule2(neighbors);
    this.rule3(neighbors);
    this.rule4(neighbors);
    //this.checkForDeadLinks();
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
        this.didGetNewChild();
      }
  }

  startAcceptingNewLeaf(){
    if(this.child){
      this.child.startAcceptingNewLeaf();
    }
    else{ // leaf
      this.shouldAcceptChildren = true;
    }
  }

  didGetNewChild(){
    if(this.parent){
      this.parent.didGetNewChild();
      return;
    }
    // from here: CH
    if(this.isClusterHead()){
      this.clusterHead.didGetNewChild();
    }
  }


  checkForDeadLinks(){
    if(this.child){
      if(this.distanceTo(this.child) > this.rangeRadius){
        this.removeChild();
      }
    }
  }

  removeChild(){
    if(this.child){
      this.child.didBecomeDUAV();
      this.child = null;
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
    this._color = UAVColor.DUAV;
    this.parent = null;
    if(this.child) this.child.didBecomeDUAV();
    this.child = null;
    this.weightStrokeColor = "black";
  }

  childDidAskForConnection(child){
    if(this.isClusterHead()) return this.clusterHead.childDidAskForConnection(child);
    return this.shouldAcceptChildren;
  }

  rule1(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let rule1Neighbors = neighbors.filter(uav => uav.weight == maxW);
      let wasCH = this.isClusterHead();
      if(maxW > this.weight){
        this.weight = max([this.minWeight,maxW-1]);

        if(wasCH) this.didBecomeDUAV();
      }
    }
  }

  rule2(neighbors){
    if(this.maxWeightofNeighborhood(neighbors) == this.minWeight && this.weight == this.minWeight){
        // from here: Cluster Head!
        this.weight = this.maxWeight;
        this._color = UAVColor.CLUSTER_HEAD;
        this.didBecomeClusterHead(neighbors);
    }
  }

  rule3(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let wasCH = this.isClusterHead();
      if(maxW>this.minWeight-1 && maxW <= this.weight && this.weight != this.maxWeight){
        this.weight -= 1;
        if(wasCH) this.didBecomeDUAV();
      }
    }
  }

  rule4(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let wasCH = this.isClusterHead();

      if(maxW == this.maxWeight && this.weight == this.maxWeight){
        this.weight = random(this.weight, maxW);
        this.weight -= 1;
        if(wasCH) this.didBecomeDUAV();
      }
    }
  }

  maxWeightofNeighborhood(neighbors){
    if(neighbors.length==0) return this.minWeight-1;
    let max = neighbors[0].weight;
    for(let i=1; i<neighbors.length;++i){
      if(neighbors[i].weight > max)
        max = neighbors[i].weight;
    }
    return max;
  }
=======
>>>>>>> master
}
