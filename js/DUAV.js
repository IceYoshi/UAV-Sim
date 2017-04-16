class DUAV extends UAV {

  constructor(weight, radius, position) {
    super(weight, radius, position, 'green', 40, 25);
    this.ch = false;
  }

  update(uavArray){
    super.update(uavArray);


    let neighbors = this.getNeighbors(uavArray);
    this.doKhopca(neighbors);
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
      /*let maxW = this.maxWeightofNeighborhood(neighbors);
      let rule1Neighbors = neighbors.filter(uav => uav.weight > this.weight  &&
                                                  uav.weight == maxW);
      if(rule1Neighbors.length>0){
        this.weight = max([this.maxWeight,maxW-1]);
        while(this.links.length > 0) {this.links.pop();}  // faster than any other procedure like .. = [] or .length=0, etc.
        this.links.push(rule1Neighbors[0]);
      }*/

      let maxW = this.maxWeightofNeighborhood(neighbors);
      let rule1Neighbors = neighbors.filter(uav => uav.weight == maxW);

      if(maxW > this.weight){
        this.weight = max([this.minWeight,maxW-1]);

        if(rule1Neighbors.length>0){
          while(this.links.length > 0) {this.links.pop();}
          this.links.push(rule1Neighbors[0]);
        }
      }
    }

    rule2(neighbors){
      if(this.maxWeightofNeighborhood(neighbors) == this.minWeight && this.weight == this.minWeight){
          this.weight = this.maxWeight;
          while(this.links.length > 0) {this.links.pop();}
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
