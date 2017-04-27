class DUAV extends UAV {

  constructor(id, weight, radius, position) {
    super(
      /*id:*/ id,
      /*radius:*/ radius,
      /*position:*/ position,
      /*color:*/ UAVColor.DUAV,
      /*maxSpeed:*/ 0.8,
      /*collisionThreshold:*/ 30,
      /*wobblingRadius:*/ 50,
      /*communicationRange:*/ 100
    );

    this.weight = weight;
    this.parent = null;
    this.child = null;
    this.minWeight = 0;
    this.maxWeight = 50;
    this.leastNumberOfChildren = 5;
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
    super.update(nearbyUAVs, mUAVs);
    this.doKhopca(nearbyUAVs);
    this.doOwnClustering(nearbyUAVs);
    this.doFlocking(nearbyUAVs);
    //this.checkForDeadLinks();

    /*
     * execute as last within this clode-block!
     * changes anchorPosition of itself, thus changes neighbors parameter of other uav's
    */

    this.doFormation(mUAVs);
    this.chase(mUAVs);

    this.boundWithinFlightzone();
  }

  drawOwnWeight(){
    this.textWeightGraphics.background(this._color);
    this.textWeightGraphics.stroke(this.weightStrokeColor);
    this.textWeightGraphics.text(`${this.ownWeight}         ${this.ownWeight}         ${this.ownWeight}`, this.radius, 2 * this.radius);
    texture(this.textWeightGraphics);
  }


  doFormation(mUAVs){
      if(this.isClusterHead() && chasing){
        //Vector from CH to mUAV
        let direction = this.headingTo(mUAVs[0].actualPosition).normalize();
        let formationDir = this.formationDirection(direction);

        var head = this.clusterHead;
        for(let i = 0; i < head.branches.length; i++) {
          let dTheta = (2 * Math.PI) / (head.branches.length);
          let child = head.branches[i];
          let rotTheta = i * dTheta;

          let targetPos = head.uav.actualPosition;
          if(this.distanceTo(child) <= this.collisionThreshold) {
            targetPos = head.uav.actualPosition.add(formationDir.mult(this.collisionThreshold));
            //Rotate along z axis
            targetPos.x = targetPos.x * cos(rotTheta) + targetPos.y * sin(rotTheta);
            targetPos.y = targetPos.x * -sin(rotTheta) + targetPos.y * cos(rotTheta);
          }
          else {
            targetPos = targetPos.add(direction.mult(this.collisionThreshold));
          }
          let curPos = child.actualPosition;
          let dir = targetPos.sub(curPos).normalize();
          child.applyForce(dir);
          this.moveAllBranchChildren(child, direction);
        }
      }
  }


  formationDirection(direction){
    let upDir = createVector(0, -1, 0);
    let formationDir = createVector((direction.y*upDir.z)-(direction.z*upDir.y),
                                (direction.z*upDir.x)-(direction.x*upDir.z),
                                (direction.x*upDir.y)-(direction.y*upDir.x));

    return formationDir.normalize();
  }

  moveAllBranchChildren(branchParent, mUAVDir){
    var head = branchParent;
    var child = head.child;
    while(head && child) {
      let targetPos = head.actualPosition.add(mUAVDir.mult(this.collisionThreshold));
      child.maxSpeed = 1.6;
      child.moveTo(targetPos);
      head = child;
      if(head) child = head.child;
    }
  }

  chase(mUAVs) {
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
    //return this.weight == this.maxWeight;
    return this.clusterHead != null;
  }

  calculateMeanPosition(neighbors){
    neighbors.push(this); // optional
    let sum = createVector(0,0,0);
    for(let i=0; i<neighbors.length; ++i){
      sum.add(neighbors[i].anchorPosition);
    }
    return sum.div(neighbors.length);
  }

  doFlocking(neighbors){
    if(this.shouldFlock){
      let targetPos = this.calculateMeanPosition(neighbors);
      this.anchorPosition.add(createVector( targetPos.x - this.anchorPosition.x,
                                            targetPos.y - this.anchorPosition.y,
                                            targetPos.z - this.anchorPosition.z)
                                            .normalize());
    }
  }

  doOwnClustering(neighbors){
    if(!this.isClusterHead()){
        if(!this.parent){
          let possibleConnections = neighbors.filter(uav => uav.shouldAcceptChildren)
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

}
