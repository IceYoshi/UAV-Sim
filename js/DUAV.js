class DUAV extends UAV {

  constructor(id, radius, position) {
    // radius, position, color, maxSpeed, collisionThreshold, wobblingRadius, communicationRange
    super(radius, position, 'green', 1, 40, 25, flightZoneSize/5);
    this._id = id;
  }

  update(nearbyUAVs, mUAVs) {
    super.update(nearbyUAVs, mUAVs);

    if(chasing && this._id == 0) { // Cluster head
      this.color = 'blue'
      this.chase(mUAVs);
    }
  }

  chase(mUAVs) {
    if(mUAVs && mUAVs.length > 0) {
      let mUAV = mUAVs[0];
      if(this._oldPos) {
        // Predict mUAV heading
        let n = this.headingTo(mUAV.actualPosition);
        let v = mUAV.headingFrom(this._oldPos);

        let a = p5.Vector.angleBetween(n, v);

        let nProj = cos(a) * v.mag();

        let offsetVector = v.sub(n.setMag(nProj));

        this.applyForce(offsetVector, 0.5)
      }
      this.moveTo(mUAV.actualPosition);
      this._oldPos = mUAV.actualPosition;
    }
  }

}
