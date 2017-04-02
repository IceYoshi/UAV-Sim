class Cluster{
  constructor(n){
    this.uavs = [];

    var dx = 200;
    for(var i=0; i<n; ++i){
      this.uavs.push(new UAV(createVector(0+i*dx,0,-i*200), 100, 100));
    }
    dx = -200;
    for(var i=0; i<n-1; ++i){
        this.uavs.push(new UAV(createVector(0+i*dx,0,-i*200), 100, 100));
    }
  }

  draw(){
    for(var i=0; i<this.uavs.length; ++i){
      this.uavs[i].draw();
    }
  }
}
