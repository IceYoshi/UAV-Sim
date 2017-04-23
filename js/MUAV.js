class MUAV extends UAV {

  constructor(id, radius, position) {
    super(id, radius, position, UAVColor.MUAV, 60, 150);

    this.textWeightGraphics = createGraphics(3*radius,3*radius);
  }

  draw(){
    let pos = this.actualPosition;
    push();
    translate(pos.x, pos.y, pos.z);
    fill(this._color);
    this.drawTexture();
    sphere(this._radius);
    pop();
  }

  drawTexture(){
    this.textWeightGraphics.background(this._color);
    texture(this.textWeightGraphics);
  }
}
