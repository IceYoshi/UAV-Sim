class FlightZone {

  constructor(width, height, depth) {
    this.width = width || flightZoneSize;
    this.height = height || this.width;
    this.depth = depth || this.width;
  }

  draw() {
    push();
    fill(0);
    beginShape(LINES);
    // Draw front face
    vertex(-this.width / 2, this.height / 2, this.depth/2);
    vertex(this.width / 2, this.height / 2, this.depth/2);

    vertex(this.width / 2, this.height / 2, this.depth/2);
    vertex(this.width/2, -this.height / 2, this.depth/2);

    vertex(this.width/2, -this.height / 2, this.depth/2);
    vertex(-this.width/2, -this.height / 2, this.depth/2);

    vertex(-this.width/2, -this.height / 2, this.depth/2);
    vertex(-this.width / 2, this.height / 2, this.depth/2);

    // Draw back face
    vertex(-this.width / 2, this.height / 2, -this.depth/2);
    vertex(this.width / 2, this.height / 2, -this.depth/2);

    vertex(this.width / 2, this.height / 2, -this.depth/2);
    vertex(this.width/2, -this.height / 2, -this.depth/2);

    vertex(this.width/2, -this.height / 2, -this.depth/2);
    vertex(-this.width/2, -this.height / 2, -this.depth/2);

    vertex(-this.width/2, -this.height / 2, -this.depth/2);
    vertex(-this.width / 2, this.height / 2, -this.depth/2);

    // Draw connection lines between front and back face
    vertex(-this.width / 2, this.height / 2, this.depth/2);
    vertex(-this.width / 2, this.height / 2, -this.depth/2);

    vertex(this.width / 2, this.height / 2, this.depth/2);
    vertex(this.width / 2, this.height / 2, -this.depth/2);

    vertex(this.width/2, -this.height / 2, this.depth/2);
    vertex(this.width/2, -this.height / 2, -this.depth/2);

    vertex(-this.width/2, -this.height / 2, this.depth/2);
    vertex(-this.width/2, -this.height / 2, -this.depth/2);
    endShape();
    pop();
  }
}
