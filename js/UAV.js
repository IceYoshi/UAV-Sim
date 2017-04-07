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

  constructor(radius, position, color, wobblingRadius) {
    this.radius = radius;
    this.anchorPosition = position;
    this.color = color;
    this.wobblingRadius = wobblingRadius;

    this._wobblingOffset = createVector(0,0,0);
    this._noiseSeed = {
      "x": random(100),
      "y": random(100),
      "z": random(100)
    };
    this._noiseOffset = random(100);
    this.update();
  }

  draw() {
    let pos = this.actualPosition;
    push();
    translate(pos.x, pos.y, pos.z);
    fill(this._color);
    sphere(this._radius);
    pop();
  }

  update() { // Update wobbling offset of UAV
    let randomOffset = new Object();

    for (const key of Object.keys(this._noiseSeed)) {
      noiseSeed(this._noiseSeed[key]);
      randomOffset[key] = this._wobblingRadius * (noise(this._noiseOffset) - 0.5);
    }
    this._noiseOffset += 0.01;

    this._wobblingOffset.set(randomOffset["x"], randomOffset["y"], randomOffset["z"]);
  }

}
