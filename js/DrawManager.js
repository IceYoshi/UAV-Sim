class DrawManager {

  constructor() {
    this.drawBuffer = [];
  }

  add(drawable) {
    this.drawBuffer.push(drawable);
    return drawable; // Useful for chaining
  }

  draw() {
    for(let i = 0; i < this.drawBuffer.length; i++) {
      let drawObject = this.drawBuffer[i];

      // Update object if needed
      if(!paused && typeof drawObject.update === 'function') {
        for(let i = 0; i < (velocitySlider.value() || 1); i++) {
          drawObject.update();
        }
      }

      // Draw object
      drawObject.draw();
    }
  }

  initializeObjects() {
    this.add(new FlightZone());
    this.add(new UAVManager());
  }

}
