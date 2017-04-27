class MUAV extends UAV {

  constructor(id, radius, position) {
    super(
      /*id:*/ id,
      /*radius:*/ radius,
      /*position:*/ position,
      /*color:*/ UAVColor.MUAV,
      /*maxSpeed:*/ 0.8,
      /*collisionThreshold:*/ 20,
      /*wobblingRadius:*/ 150,
      /*communicationRange:*/ 100
    );
    this.textWeightGraphics = createGraphics(9*radius,3*radius);
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
