class FlightZone {

  constructor(width, height, depth) {
    this.width = width;
    this.height = height || width;
    this.depth = depth || width;
  }

  draw() {
    push();
    box(this.width, this.height, this.depth);
    pop();
  }
}
