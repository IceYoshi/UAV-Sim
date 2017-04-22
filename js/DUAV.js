class DUAV extends UAV {

  constructor(id, weight, radius, position) {
    super(id, radius, position, UAVColor.DUAV, 40, 25);

    this.weight = weight;
    this.parent = null;
    this.child = null;
    this.minWeight = 0;
    this.maxWeight = 50;
    this.leastNumberOfChildren = 5;
    this.textWeightGraphics = createGraphics(3*radius,3*radius);
    this.weightStrokeColor = "black";
    this.statemanager = new UAVStateManager(UAVStateEnum.KHOPCA);

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

  drawOwnWeight(){
    this.textWeightGraphics.background(this.color);
    this.textWeightGraphics.stroke(this.weightStrokeColor);
    this.textWeightGraphics.text(this.ownWeight, this.radius, this.radius);
    texture(this.textWeightGraphics);
  }

  update(uavArray){
    super.update(uavArray);

    let neighbors = this.getNeighbors(uavArray);
    this.doKhopca(neighbors);
    this.doOwnClustering(neighbors);

    /*
     * execute as last within this clode-block!
     * changes anchorPosition of itself, thus changes neighbors parameter of other uav's
     */
     this.doFlocking(neighbors);
     this.boundWithinFlightzone();
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
                                              .sort(function(u1,u2){u2.weight-u1.weight});
          if(possibleConnections.length>0){
            let uav = possibleConnections[0];
            if(uav.childDidAskForConnection(this))  uav.appendChild(this);
          }
        }
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
        uav.color = this.color;
        this.didGetNewChild();
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
      this.clusterHead.clearBranches();
      this.clusterHead = null;
    }
    this.ownWeight = 0;
    this.shouldAcceptChildren = false;
    this.shouldFlock = true;
    this.color = UAVColor.DUAV;
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
        this.color = UAVColor.CLUSTER_HEAD;
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
