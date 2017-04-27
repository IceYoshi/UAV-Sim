class KHOPCA {

  constructor(uav) {
      this._uav = uav
      this.weight = 1;
      this.minWeight = 0;
      this.maxWeight = 50;
  }

  run(neighbors) {
    this.rule1(neighbors);
    this.rule2(neighbors);
    this.rule3(neighbors);
    this.rule4(neighbors);
  }

  rule1(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let rule1Neighbors = neighbors.filter(uav => uav.khopca.weight == maxW);
      let wasCH = this._uav.isClusterHead();
      if(maxW > this.weight){
        this.weight = max(this.minWeight,maxW-1);
        if(wasCH) this._uav.didBecomeDUAV();
      }
    }
  }

  rule2(neighbors){
    if(this.maxWeightofNeighborhood(neighbors) == this.minWeight && this.weight == this.minWeight){
        // from here: Cluster Head!
        this.weight = this.maxWeight;
        this._uav._color = UAVColor.CLUSTER_HEAD;
        this._uav.didBecomeClusterHead(neighbors);
        //print(this._uav.id + " just became clusterhead.");
    }
  }

  rule3(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let wasCH = this._uav.isClusterHead();
      if(maxW>this.minWeight-1 && maxW <= this.weight && this.weight != this.maxWeight){
        this.weight -= 1;
        if(wasCH) this._uav.didBecomeDUAV();
      }
    }
  }

  rule4(neighbors){
    let maxW = this.maxWeightofNeighborhood(neighbors);
    if(maxW>=this.minWeight){
      let wasCH = this._uav.isClusterHead();
      if(maxW == this.maxWeight && this.weight == this.maxWeight){
        this.weight = random(this.weight, maxW);
        this.weight -= 1;
        if(wasCH) this._uav.didBecomeDUAV();
      }
    }
  }

  maxWeightofNeighborhood(neighbors){
    if(neighbors.length==0) return this.minWeight-1;
    let max = neighbors[0].khopca.weight;
    for(let i=1; i<neighbors.length;++i){
      if(neighbors[i].khopca.weight > max)
        max = neighbors[i].khopca.weight;
    }
    return max;
  }

}
