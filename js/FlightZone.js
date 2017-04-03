class FlightZone {

  constructor(width, height, depth) {
    this.width = width;
    this.height = height || width;
    this.depth = depth || width;
  }

  draw() {
    push();
    noFill();
    stroke(0,0,0,100)
    box(this.width, this.height, this.depth);

    pop();
  }
}
