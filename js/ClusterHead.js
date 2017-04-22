class ClusterHead{
  constructor(uav){
    this.uav = uav;
    this.nrOfBranches = 4;
    this.nrOfIncomingMsg = 0;
    this.branches = [];
    uav.shouldAcceptChildren = true;
    uav.ownWeight = 0;

    if(uav.parent) uav.parent.removeChild(this);
    uav.parent = null;
  }

  draw(){
    var head = this.uav;
    for(let i=0; i<this.branches.length; ++i){
      var child = this.branches[i];
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

  clearBranches(){
    for(let i=0; i<this.branches.length; ++i)
      this.branches[i].didBecomeDUAV();

    this.branches = [];
  }

  childDidAskForConnection(child){
    return this.branches.length<this.nrOfBranches;
  }

  appendChild(child){
    this.branches.push(child);
    child.parent = this.uav;
    child.ownWeight = this.uav.ownWeight+1;
    this.uav.shouldFlock = child.shouldFlock = false;
    if(this.branches.length==this.nrOfBranches && this.uav.shouldAcceptChildren){
        this.uav.shouldAcceptChildren = false;

        for(let i=0; i<this.branches.length; ++i){
          this.branches[i].shouldAcceptChildren = true;
        }
    }
    child.color = UAVColor.BRANCH_COLOR[this.branches.length%this.nrOfBranches];
  }

  didGetNewChild(){
    if(++this.nrOfIncomingMsg == this.branches.length){
      this.startAcceptingAdditionalChild();
      this.nrOfIncomingMsg = 0;
    }
  }

  startAcceptingAdditionalChild(){
    for(let i=0; i<this.branches.length;++i){
        let head = this.branches[i];
        let tail = head.child;
        while(tail){
            head = tail;
            tail = tail.child;
        }
        tail = head;
        tail.shouldAcceptChildren = true;
    }
  }

  removeBranch(branchChild){
      if(this.hasBranch(branchHead)){
        this.branches = this.branches.filter(uav => uav.id = branchChild.id);
        branchChild.didBecomeDUAV();
      }
  }

  hasBranch(branchHead){
    return this.branches.filter(uav => uav.id = branchHead.id).length>0;
  }
}
