class FlightZone {

  get enableFill() {
    return this._enableFill;
  }
  set enableFill(value) {
    this._enableFill = value;
  }

  constructor(drawManager, width, height, depth) {
    this.width = width || 500;
    this.height = height || this.width;
    this.depth = depth || this.width;

    this._enableFill = false;

    drawManager.add(this);
  }

  draw() {
    push();
    if(this._enableFill) {
      fill(0,0,0,100);
      box(this.width, this.height, this.depth);
    } else {
      fill(0);
      beginShape(LINES);
      vertex(-this.width / 2, this.height / 2, this.depth/2);
      vertex(this.width / 2, this.height / 2, this.depth/2);

      vertex(this.width / 2, this.height / 2, this.depth/2);
      vertex(this.width/2, -this.height / 2, this.depth/2);

      vertex(this.width/2, -this.height / 2, this.depth/2);
      vertex(-this.width/2, -this.height / 2, this.depth/2);

      vertex(-this.width/2, -this.height / 2, this.depth/2);
      vertex(-this.width / 2, this.height / 2, this.depth/2);
      endShape();

      beginShape(LINES);
      vertex(-this.width / 2, this.height / 2, -this.depth/2);
      vertex(this.width / 2, this.height / 2, -this.depth/2);

      vertex(this.width / 2, this.height / 2, -this.depth/2);
      vertex(this.width/2, -this.height / 2, -this.depth/2);

      vertex(this.width/2, -this.height / 2, -this.depth/2);
      vertex(-this.width/2, -this.height / 2, -this.depth/2);

      vertex(-this.width/2, -this.height / 2, -this.depth/2);
      vertex(-this.width / 2, this.height / 2, -this.depth/2);
      endShape();

      beginShape(LINES);
      vertex(-this.width / 2, this.height / 2, this.depth/2);
      vertex(-this.width / 2, this.height / 2, -this.depth/2);

      vertex(this.width / 2, this.height / 2, this.depth/2);
      vertex(this.width / 2, this.height / 2, -this.depth/2);

      vertex(this.width/2, -this.height / 2, this.depth/2);
      vertex(this.width/2, -this.height / 2, -this.depth/2);

      vertex(-this.width/2, -this.height / 2, this.depth/2);
      vertex(-this.width/2, -this.height / 2, -this.depth/2);
      endShape();
    }
    pop();
  }
}
