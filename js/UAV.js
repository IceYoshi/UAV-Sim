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
  get velocity() {
    return this._velocity;
  }
  set velocity(value) {
    this._velocity = value;
  }

  constructor(radius, position, color) {
    this._radius = radius || 50;
    this._position = position || createVector(0,0,0);
    this._color = color || color(0, 0, 0);
    this._velocity = createVector(0,0,0);
  }

  draw() {
    push();
    translate(this._position.x, this._position.y, this._position.z);
    fill(this._color);
    sphere(this._radius);
    pop();
  }

}
