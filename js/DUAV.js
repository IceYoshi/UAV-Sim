class DUAV extends UAV {

  constructor(weight, radius, position) {
    super(weight, radius, position, 'green', 40, 25);
    this.links = [];
    this.shouldAcceptConnection = true;

    this.statemanager = new UAVStateManager(UAVStateEnum.OWN_CLUSTERING);
  }

  update(uavArray){
    super.update(uavArray);

    switch (this.statemanager.getCurrentState()) {
      /*case UAVStateEnum.KHOPCA:
        let neighbors = this.getNeighbors(uavArray);
        this.doClustering(neighbors);
        break;*/
      case UAVStateEnum.OWN_CLUSTERING:
        let neighbors = this.getNeighbors(uavArray);
        this.doClustering(neighbors);
      //console.log(this.getChildrenCount());
        break;
      default: break;

    }
  }

  checkDeadLinks(){
    let arr2remove = [];
    for(let i=0; i<this.links.length; ++i){
      let uav = this.links[i];
      if(this.distanceTo(uav)>this.rangeRadius){
        arr2remove.push(uav);
      }
    }

    for(let i=0; i<arr2remove.length; ++i){
      this.links.filter(uav => uav.weight == arr2remove[i].weight);
    }
  }

  doClustering(neighbors){
    this.checkDeadLinks();
    this.links.filter(uav => uav instanceof MUAV);

    for(let i=0; i<neighbors.length; ++i){
      let uav = neighbors[i];
      if(!this.links.includes(uav)){
          this.links.push(uav);
      }
    }
  }

  getChildrenCount(){
    let c = this.child;
    let counter = 0;
    while(c.child){
      c = c.child;
      counter++;
    }
    console.log(counter);
  }

  doKhopca(neighbors){
    this.rule1(neighbors);
    this.rule2(neighbors);
    this.rule3(neighbors);
    this.rule4(neighbors);
  }

  draw(){
    let pos = this.actualPosition;
    push();
    translate(pos.x, pos.y, pos.z);
    fill(this._color);
    if(this.weight != this.maxWeight){
        this.textWeightGraphics.background(this.color);
    }
    else{ // cluster head
        this.textWeightGraphics.background("blue");
    }
    this.textWeightGraphics.text(this.weight, this.radius, this.radius);
    texture(this.textWeightGraphics);
    sphere(this._radius);
    pop();
  }

    rule1(neighbors){
      let maxW = this.maxWeightofNeighborhood(neighbors);
      let rule1Neighbors = neighbors.filter(uav => uav.weight > this.weight  &&
                                                  uav.weight == maxW);
      if(maxW > this.weight){
        this.weight = max([this.minWeight,maxW-1]);

        if(rule1Neighbors.length>0){
          rule1Neighbors.sort(function(a,b){return b-a});
          this.parent = rule1Neighbors[0];
          rule1Neighbors[0].child = this;
        }
      }
    }

    rule2(neighbors){
      if(this.maxWeightofNeighborhood(neighbors) == this.minWeight && this.weight == this.minWeight){
          this.weight = this.maxWeight; // cluster heading()
          this.statemanager.goToState(UAVStateEnum.OWN_CLUSTERING);
      }
    }

    rule3(neighbors){
      let maxW = this.maxWeightofNeighborhood(neighbors);
      if(maxW>this.minWeight-1 && maxW <= this.weight && this.weight != this.maxWeight){
        this.weight -= 1;
      }
    }

    rule4(neighbors){
      let maxW = this.maxWeightofNeighborhood(neighbors);

      if(maxW == this.maxWeight && this.weight == this.maxWeight){
        this.weight = random(this.weight, maxW);
        this.weight -= 1;
      }
    }

    getNeighbors(uavArray){
        return uavArray.filter(uav => uav.distanceTo(this) < this.rangeRadius);
    }

    maxWeightofNeighborhood(neighbors){
      if(neighbors.length==0) return this.minWeight-1;
      let max = neighbors[0].weight;
      for(let i=0; i<neighbors.length;++i){
        if(neighbors[i].weight > max)
          max = neighbors[i].weight;
      }
      return max;
    }
}
