class UAVCluster {

  constructor(drawManager, count) {
    let uav_radius = 10;
    for(var i = 0; i < count; i++) {
      new DUAV(drawManager, uav_radius, createVector(-250, random(-250, 250), random(-250, 250)))
    }
  }

}
