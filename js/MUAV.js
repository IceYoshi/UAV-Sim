class MUAV extends UAV {

  constructor(position) {

    super(
      /*id:*/ null,
      /*radius:*/ Config.muav.radius,
      /*position:*/ position,
      /*color:*/ Config.muav.color,
      /*maxSpeed:*/ Config.muav.maxSpeed,
      /*collisionThreshold:*/ Config.muav.collisionThreshold,
      /*wobblingRadius:*/ Config.muav.wobblingRadius,
      /*communicationRange:*/ Config.cluster.communicationRange
    );
    this.textWeightGraphics = createGraphics(
      9 * Config.muav.radius,
      3 * Config.muav.radius
    );

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
