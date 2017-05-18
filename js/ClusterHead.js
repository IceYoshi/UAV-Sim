class ClusterHead{
  constructor(uav){
    this.uav = uav;
    this.nrOfBranches = Config.cluster.numOfBranches;
    this.branches = [];
    for(let i = 0; i < this.nrOfBranches; i++) {
      this.branches.push(new UAVBranch(Config.cluster.branchColors[i % Config.cluster.branchColors.length]));
    }
    uav.shouldAcceptChildren = true;
    uav.ownWeight = 0;

    if(uav.parent) uav.parent.removeChild(this);
    uav.parent = null;
  }

  draw(){
    var head = this.uav;
    let branches = this.getOccupiedBranches();
    for(let i=0; i<branches.length; ++i){
      var child = branches[i].head;
      while(head && child){
        push();
          let pos1 = head.actualPosition;
          let pos2 = child.actualPosition;
          vertex(pos1.x, pos1.y, pos1.z);
          vertex(pos2.x, pos2.y, pos2.z);
        pop();
        head = child;
        if(head) child = head.child;
      }
      head = this.uav;
    }
  }

  doChase(mUAVs) {
    if(mUAVs && mUAVs.length > 0) {
      let mUAV = mUAVs[0];
      if(this._oldMUAVPos) {
        // Predict mUAV heading
        let n = this.uav.headingTo(mUAV.actualPosition);
        let v = mUAV.headingFrom(this._oldMUAVPos);

        let a = p5.Vector.angleBetween(n, v);

        let vProj = n.setMag(cos(a) * v.mag());

        let offsetVector = v.sub(vProj);

        this.uav.applyForce(offsetVector, 0.2);
      }
      this.uav.moveTo(mUAV.actualPosition, 0.5);
      this._oldMUAVPos = mUAV.actualPosition;
    }
  }

  getOccupiedBranches() {
    return this.branches.filter(branch => branch.head);
  }

  getFreeBranches() {
    return this.branches.filter(branch => !branch.head);
  }

  getNumberOfOccupiedBranches() {
    return this.getOccupiedBranches().length;
  }

  getBranchOfHead(head) {
    let branch = this.getOccupiedBranches().filter(branch => branch.head.id == head.id);
    return branch.length > 0 ? branch[0] : null;
  }

  hasBranch(head){
    return this.getBranchOfHead(head) != null;
  }

  clearBranches(){
    let branches = this.getOccupiedBranches();
    for(let i=0; i<branches.length; ++i) {
      branches[i].head.didBecomeDUAV();
      branches[i].head = null;
    }
  }

  willBecomeDUAV(){
    this.clearBranches();
  }

  childDidAskForConnection(child){
    return this.getNumberOfOccupiedBranches()<this.nrOfBranches;
  }

  appendChild(child){
    let branch = this.getFreeBranches()[0];
    branch.head = child;
    child._color = branch.color;
    child.parent = this.uav;
    child.ownWeight = this.uav.ownWeight+1;
    this.uav.shouldFlock = child.shouldFlock = false;
    let branches = this.getOccupiedBranches();
    if(branches.length == this.nrOfBranches && this.uav.shouldAcceptChildren){
        this.uav.shouldAcceptChildren = false;
        this.startAcceptingAdditionalLeaf();
    }
  }

  didGetNewChild(branchhead){
    let branch = this.getBranchOfHead(branchhead);
    if(branch) {
      branch.length++;
      this.startAcceptingAdditionalLeaf();
    }
  }

  startAcceptingAdditionalLeaf(){
    let branches = this.getOccupiedBranches();
    if(branches.length == this.nrOfBranches) {
      let minBranchLength = min(branches.map(branch => branch.length));
      for(let i=0; i<branches.length; ++i){
        if(branches[i].length == minBranchLength) {
          branches[i].head.startAcceptingNewLeaf();
        }
      }
    }
  }

  stopAcceptingAdditionalLeaf(){
    let branches = this.getOccupiedBranches();
    for(let i=0; i<branches.length; ++i){
      branches[i].head.stopAcceptingNewLeaf();
    }
  }

  removeBranch(branchChild){
    let branch = this.getBranchOfHead(branchChild);
    if(branch) {
      branch.head.didBecomeDUAV();
      branch.head = null;

      if(this.getNumberOfOccupiedBranches() == 0) {
        this.uav.khopca.weight = this.uav.khopca.maxWeight - 1;
        this.uav.didBecomeDUAV();
      } else {
        this.stopAcceptingAdditionalLeaf();
        this.balanceCluster();
        this.uav.shouldAcceptChildren = true;
      }
    }
  }

  didLoseChild(branchChild, weight) {
    let branch = this.getBranchOfHead(branchChild);
    if(branch) {
      branch.length = weight;
      this.stopAcceptingAdditionalLeaf();
      this.balanceCluster();
      this.startAcceptingAdditionalLeaf();
    }
  }

  balanceCluster() {
    let branches = this.getOccupiedBranches();
    let minBranchLength = min(this.branches.map(branch => branch._length));
    for(let i=0; i<branches.length; ++i){
      if(branches[i].length > minBranchLength + 1) {
        branches[i].head.removeChildAt(minBranchLength + 2);
        branches[i].length = minBranchLength + 1;
      }
    }
  }

  checkForDeadLinks(){
    let branches = this.getOccupiedBranches();
    for(let i = 0; i < branches.length; i++) {
      if(this.uav.distanceTo(branches[i].head) > this.uav._communicationRange){
        this.removeBranch(branches[i].head);
      }
    }
  }

  doFormation(mUAVs){
    if(formation) {

      let clusterRadius = 1.25 * this.uav.collisionThreshold;
      let occupiedBranches = this.getOccupiedBranches();
      let dTheta = (TWO_PI) / (occupiedBranches.length);

      for(let i = 0; i < occupiedBranches.length; i++) {
          let child = occupiedBranches[i].head;
          let rotTheta = i * dTheta;

          let yAxis = createVector(0, 1, 0);
          let dir =  this.uav.headingTo(mUAVs[0].actualPosition)
                         .normalize()
                         .mult(clusterRadius);
          let v = this.crossProduct(dir, yAxis);
          let k = dir.normalize();

          let kCrossV = this.crossProduct(k, v);
          let kDotV = this.dotProduct(k, v);

          let r1 = v.mult(cos(rotTheta));
          let r2 = r1.add(kCrossV.mult(sin(rotTheta)));
          let r3 = r2.add(k.mult(kDotV).mult(1 - cos(rotTheta)));

          let rotDir = r3.mult(clusterRadius);
          let targetPos = this.uav.actualPosition.add(dir).add(rotDir);

          //Move towards the mUAV
          let curPos = child.actualPosition;
          dir = targetPos.sub(curPos).normalize();
          child.applyForce(dir);

          dir =  this.uav.headingTo(mUAVs[0].actualPosition)
                         .normalize()
                         .mult(clusterRadius);
          this.moveAllBranchChildren(child, dir);
      }
    }
  }

  crossProduct(vec1, vec2) {
    let res = createVector((vec1.y * vec2.z) - (vec1.z * vec2.y),
                           (vec1.z * vec2.x) - (vec1.x * vec2.z),
                           (vec1.x * vec2.y) - (vec1.y * vec2.x));
    return res.normalize();
  }

  dotProduct(vec1, vec2) {
    let res = createVector((vec1.x * vec2.x)
                           + (vec1.y * vec2.y)
                           + (vec1.z * vec2.z));
    return res;
  }

  moveAllBranchChildren(branchParent, mUAVDir) {
    var head = branchParent;
    var child = head.child;
    while(head && child) {
      let targetPos = head.actualPosition.add(mUAVDir);
      let curPos = child.actualPosition;
      let dir = targetPos.sub(curPos).normalize();
      child.maxSpeed = 1.0;
      child.applyForce(dir);

      head = child;
      if(head) child = head.child;
    }
  }

    applyRotationMatrix(direction, formationDir, rotTheta){
      let rotPos = createVector(0, 0, 0);
      let x = direction.x;
      let y = direction.y;
      let z = direction.z;
      let c = cos(rotTheta);
      let s = sin(rotTheta);
      let t = 1-c;
      rotPos.x =    (formationDir.x * (c + x * x * t))
                  + (formationDir.y * (y * x * t + z * s))
                  + (formationDir.z * (z * x * t - y * s));
      rotPos.y =    (formationDir.x * (x * y * t - z * s))
                  + (formationDir.y * (c + y * y * t))
                  + (formationDir.z * (z * y * t + x * s));
      rotPos.z =    (formationDir.x * (x * z * t + y * s))
                  + (formationDir.y * (y * z * t - x * s))
                  + (formationDir.z * (c + z * z * t));

      return rotPos;
    }

}
