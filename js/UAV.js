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

  constructor(radius, position, color, wobblingRadius) {
    this._radius = radius || 50;
    this._position = position || createVector(0,0,0);
    this._color = color || color(0, 0, 0);

    this._wobblingRadius = wobblingRadius || 0;
    this._offset = createVector(0,0,0);
    this._noiseSeedX = random(100);
    this._noiseSeedY = random(100);
    this._noiseSeedZ = random(100);
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
    let randomX = (noise(frameCount * 0.01) - 0.5) * this._wobblingRadius;
    noiseSeed(this._noiseSeedY);
    let randomY = (noise(frameCount * 0.01) - 0.5) * this._wobblingRadius;
    noiseSeed(this._noiseSeedZ);
    let randomZ = (noise(frameCount * 0.01) - 0.5) * this._wobblingRadius;

    this._offset.set(randomX, randomY, randomZ);
  }

}
