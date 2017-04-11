class UAV {

  get anchorPosition() {
    return this._anchorPosition;
  }
  set anchorPosition(value) {
    this._anchorPosition = value || createVector(0,0,0);
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = value || 50;
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value || color(0);
  }
  get collisionThreshold() {
    return this._collisionThreshold;
  }
  set collisionThreshold(value) {
    this._collisionThreshold = value || 0;
  }
  get wobblingRadius() {
    return this._wobblingRadius;
  }
  set wobblingRadius(value) {
    this._wobblingRadius = Math.max(0, value || 0);
    this._offset = createVector(0,0,0);
  }
  get actualPosition() {
    return p5.Vector.add(this._anchorPosition, this._wobblingOffset);
  }
  get isClusterHead() {
    return this._isClusterHead;
  }
  set isClusterHead(value) {
    this._isClusterHead = value;
  }
  get uavID() {
    return this._uavID;
  }

constructor(uavID, radius, position, isClusterHead, color, collisionThreshold, wobblingRadius) {
    this._uavID = uavID;
    this.radius = radius;
    this.anchorPosition = position;
    this.isClusterHead = isClusterHead;
    this.color = color;
    this._collisionThreshold = collisionThreshold || 50;
    this.wobblingRadius = wobblingRadius;
    this._wobblingOffset = createVector(0,0,0);
    this._noiseSeed = {
      "x": random(1000),
      "y": random(1000),
      "z": random(1000)
    };
    this._noiseOffset = random(1000);
    this.updateWobblingOffset();

    this._distanceToClusterHead = 0;
    this._uavDistanceArray = [];
  }

  draw() {
    let pos = this.actualPosition;
    push();
    translate(pos.x, pos.y, pos.z);
    fill(this._color);
    sphere(this._radius);
    pop();
  }

  update(uavArray) {
    if(wobbling) this.updateWobblingOffset();
    if(collision) this.performCollisionAvoidance(uavArray);
    if(formation) this.performClusterFormation(uavArray);
  }

  updateWobblingOffset() {
    let randomOffset = new Object();

    for(const key of Object.keys(this._noiseSeed)) {
      randomOffset[key] = this._wobblingRadius * (noise(this._noiseOffset + this._noiseSeed[key]) - 0.5);
    }
    this._noiseOffset += 0.01;

    this._wobblingOffset.set(randomOffset.x, randomOffset.y, randomOffset.z);
  }

  performCollisionAvoidance(uavArray) {
    if(uavArray != null) {
      let vectorSum = createVector(0, 0, 0);
      for(var i = 0; i < uavArray.length; i++) {
        let uav = uavArray[i];
        let distance = this.distanceTo(uav);
        if(distance < this._collisionThreshold) {
          let pos = this.actualPosition;
          let pos2 = uav.actualPosition;
          vectorSum.add(createVector(pos.x - pos2.x, pos.y - pos2.y, pos.z - pos2.z)
            .normalize()
            .mult(this._collisionThreshold + 10 - distance)
            .div(50));
        }
      }
      this.anchorPosition.add(vectorSum);
    }
  }

  performClusterFormation(uavArray) {
    let targetReached = true;
    let numClusterMembers = 4;
    if(uavArray != null) {
      if(this.isClusterHead) {
        this.color = 'yellow';
        for(var i = 0; i < uavArray.length; i++) {
          let uav = uavArray[i];
          if(uav.color != 'red'){
            uav.color = 'green';
          }          
          if(uav._uavID > this._uavID) {
            if(this._uavDistanceArray.length == uavArray.length - 1) {
              if(this.distanceTo(uav) - this._uavDistanceArray[uav._uavID - 1] > this.collisionThreshold){
                this._uavDistanceArray[uav._uavID - 1] = this.distanceTo(uav);
              }
            }
            else {
              this._uavDistanceArray[uav._uavID - 1] = this.distanceTo(uav);
            }
          }
        }
        let tempDistanceArray = Array.from(this._uavDistanceArray).sort(function(a, b) {return a - b;});
        for(var j = 0; j < numClusterMembers; j++) {
          let distance = tempDistanceArray[j];
          for(var k = 0; k < this._uavDistanceArray.length; k++) {
            if(this._uavDistanceArray[k] == distance) {
              let curUavID = k + 1;
              uavArray[curUavID].color = 'blue';

              let curPos = uavArray[curUavID].anchorPosition;
              let clusterHeadPos = this.anchorPosition;
              let targetPos = createVector(clusterHeadPos.x + this.collisionThreshold,
                clusterHeadPos.y + Math.pow(-1, ~~(j * 0.5)) * this.collisionThreshold, clusterHeadPos.z + Math.pow(-1, j) * this.collisionThreshold);

                if(this.distanceBetween(curPos, targetPos) > 0.5) {
                  targetReached = false;
                  let dir = createVector(targetPos.x - curPos.x, targetPos.y - curPos.y, targetPos.z - curPos.z)
                  uavArray[curUavID].anchorPosition.add(dir.normalize());
                }
              }
            }
        }
        if(targetReached) formation = false;
      }
    }
  }

  distanceTo(uav) {
    let pos = this.actualPosition;
    let pos2 = uav.actualPosition;
    return dist(pos.x, pos.y, pos.z, pos2.x, pos2.y, pos2.z);
  }
  distanceBetween(curPos, targetPos) {
    return dist(curPos.x, curPos.y, curPos.z, targetPos.x, targetPos.y, targetPos.z);
  }
}
