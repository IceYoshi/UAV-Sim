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
  set maxSpeed(value) {
    this._maxSpeed = Math.max(0, value || 1);
  }
  get maxSpeed() {
    return this._maxSpeed;
  }
  set collisionThreshold(value) {
    this._collisionThreshold = Math.max(0, value || 50);
  }
  get collisionThreshold() {
    return this._collisionThreshold;
  }
  set communicationRange(value) {
    this._communicationRange = Math.max(0, value || 0);
  }
  get communicationRange() {
    return this._communicationRange;
  }

  constructor(radius, position, color, maxSpeed, collisionThreshold, wobblingRadius, communicationRange) {
    this.radius = radius;
    this.anchorPosition = position;
    this.color = color;
    this.maxSpeed = maxSpeed;
    this.collisionThreshold = collisionThreshold;
    this.wobblingRadius = wobblingRadius;
    this.communicationRange = communicationRange;
    this._cumulativeForce = createVector(0,0,0);

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

  update(nearbyUAVs, mUAVs) {
    if(wobbling) this.updateWobblingOffset();
    if(collision) this.performCollisionAvoidance(nearbyUAVs.concat(mUAVs));

    this.executeMovement();

    let pos = this.actualPosition;
    let offset = this instanceof DUAV ? 0 : flightZoneSize/5;
    let cx = constrain(pos.x, -flightZoneSize/2 - offset, flightZoneSize/2 + offset);
    let cy = constrain(pos.y, -flightZoneSize/2 - offset, flightZoneSize/2 + offset);
    let cz = constrain(pos.z, -flightZoneSize/2 - offset, flightZoneSize/2 + offset);
    this.anchorPosition.add(cx - pos.x, cy - pos.y, cz - pos.z);
  }

  updateWobblingOffset() {
    let randomOffset = new Object();

    for(const key of Object.keys(this._noiseSeed)) {
      randomOffset[key] = this.wobblingRadius * (noise(this._noiseOffset + this._noiseSeed[key]) - 0.5);
    }
    this._noiseOffset += 0.005;

    this._wobblingOffset.set(randomOffset.x, randomOffset.y, randomOffset.z);
  }

  performCollisionAvoidance(nearbyUAVs) {
    if(nearbyUAVs != null) {
      let vectorSum = createVector(0, 0, 0);
      for(var i = 0; i < nearbyUAVs.length; i++) {
        let uav = nearbyUAVs[i];
        let distance = this.distanceTo(uav);
        if(distance < this.collisionThreshold) {
          vectorSum.add(this.headingFrom(uav.actualPosition)
            .normalize()
            .mult(1 + (distance/this.collisionThreshold))
          )
        }
      }
      this.applyForce(vectorSum);
    }
  }

  distanceTo(uav) {
    let pos = this.actualPosition;
    let pos2 = uav.actualPosition;
    return dist(pos.x, pos.y, pos.z, pos2.x, pos2.y, pos2.z);
  }

  headingTo(pos) {
    let p = this.actualPosition;
    return createVector(pos.x - p.x, pos.y - p.y, pos.z - p.z);
  }

  headingFrom(pos) {
    return this.headingTo(pos).mult(-1);
  }

  moveTo(pos) {
    this.applyForce(this.headingTo(pos));
  }

  applyForce(v, w) {
    this._cumulativeForce.add(v.normalize().mult(w || 1));
  }

  executeMovement() {
    this.anchorPosition.add(this._cumulativeForce.limit(this.maxSpeed));
    this._cumulativeForce.set(0,0,0);
  }

}
