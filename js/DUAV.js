class DUAV extends UAV {

  constructor(id, weight, radius, position) {
    super(id, radius, position, 'green', 40, 25);

    this.weight = weight;
    this.parent = null;
    this.children = [];
    this.minWeight = 0;
    this.maxWeight = 50;
    this.textWeightGraphics = createGraphics(3*radius,3*radius);
    this.statemanager = new UAVStateManager(UAVStateEnum.KHOPCA);
  }

  draw(){
    let pos = this.actualPosition;
    push();
    translate(pos.x, pos.y, pos.z);
    fill(this._color);
    this.textWeightGraphics.background(this.color);
    this.textWeightGraphics.text(this.weight, this.radius, this.radius);
    texture(this.textWeightGraphics);
    sphere(this._radius);
    pop();
  }

  update(uavArray){
    super.update(uavArray);

    switch (this.statemanager.getCurrentState()) {
          case UAVStateEnum.KHOPCA:
              this.doKhopca(this.getNeighbors(uavArray));
          case UAVStateEnum.OWN_CLUSTERING:
            break;
          default: break;
    }
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

  appendChild(uav){
    if(!this.existsChild(uav)){
      this.children.push(uav);
    }
  }

  removeChild(uav){
    this.children = this.children.filter(u => u.id != uav.id);
  }

  existsChild(uav){
    return this.children.filter(child => child.id == uav.id).length>0;
  }

    rule1(neighbors){
      let maxW = this.maxWeightofNeighborhood(neighbors);
      let rule1Neighbors = neighbors.filter(uav => uav.weight == maxW);

      if(maxW > this.weight){
        this.weight = max([this.minWeight,maxW-1]);

        if(rule1Neighbors.length>0){
          if(this.parent)
              this.parent.removeChild(this);
          this.parent = rule1Neighbors[0];
          rule1Neighbors[0].appendChild(this);
        }
      }
    }

    rule2(neighbors){
      if(this.maxWeightofNeighborhood(neighbors) == this.minWeight && this.weight == this.minWeight){
          this.weight = this.maxWeight;

          // important, delete link that exists previously before being a clusterhead!!
          if(this.parent)
            this.parent.removeChild(this);
          this.parent = null;
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
      for(let i=1; i<neighbors.length;++i){
        if(neighbors[i].weight > max)
          max = neighbors[i].weight;
      }
      return max;
    }
}
