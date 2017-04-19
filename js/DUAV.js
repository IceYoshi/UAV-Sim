class DUAV extends UAV {

  constructor(id, radius, position) {
    super(radius, position, 'green', 1.5, 40, 25);
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
        this.moveTo(mUAV.actualPosition.copy().add(mUAV.headingFrom(this._oldPos).mult(this.distanceTo(mUAV)/3)));
      } else {
        this.moveTo(mUAV.actualPosition);
      }
      this._oldPos = mUAV.actualPosition;
    }
  }

}
