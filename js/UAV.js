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

  constructor(radius, position, color, collisionThreshold, wobblingRadius) {
    this.radius = radius;
    this.anchorPosition = position;
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

  distanceTo(uav) {
    let pos = this.actualPosition;
    let pos2 = uav.actualPosition;
    return dist(pos.x, pos.y, pos.z, pos2.x, pos2.y, pos2.z);
  }

}
