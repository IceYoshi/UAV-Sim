class UAV {

  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
  }
  get wobblingRadius() {
    return this._wobblingRadius;
  }
  set wobblingRadius(value) {
    this._wobblingRadius = Math.max(0, value);
    this._offset = createVector(0,0,0);
  }

  constructor(radius, position, color, wobblingRadius) {
    this._radius = radius || 50;
    this._position = position || createVector(0,0,0);
    this._color = color || color(0, 0, 0);

    this._wobblingRadius = Math.max(0, wobblingRadius || 0);
    this._offset = createVector(0,0,0);
    this._noiseSeedX = random(100);
    this._noiseSeedY = random(100);
    this._noiseSeedZ = random(100);
    this._noiseOffset = random(100);
    noiseDetail(8, 0.3);
  }

  draw() {
    push();
    translate(this._position.x + this._offset.x,
      this._position.y + this._offset.y,
      this._position.z + this._offset.z);
    fill(this._color);
    sphere(this._radius);
    pop();
  }

  update() { // Update wobbling offset of UAV
    noiseSeed(this._noiseSeedX);
    let randomX = (noise(this._noiseOffset) - 0.5) * this._wobblingRadius;
    noiseSeed(this._noiseSeedY);
    let randomY = (noise(this._noiseOffset) - 0.5) * this._wobblingRadius;
    noiseSeed(this._noiseSeedZ);
    let randomZ = (noise(this._noiseOffset) - 0.5) * this._wobblingRadius;
    this._noiseOffset += 0.01;
    this._offset.set(randomX, randomY, randomZ);
  }

}
