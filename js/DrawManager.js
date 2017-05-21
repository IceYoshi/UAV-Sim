class DrawManager {

  constructor() {
    this.drawBuffer = [];
  }

  stop() {
    this._stop = true;
  }

  add(drawable) {
    this.drawBuffer.push(drawable);
    return drawable; // Useful for chaining
  }

  draw() {
    let val = velocitySlider.slider("option","value");
    for(let i = 0; i < this.drawBuffer.length; i++) {
      let drawObject = this.drawBuffer[i];

      // Update object if needed
      if(!paused && typeof drawObject.update === 'function') {
        for(let i = 0; i < (val || 1); i++) {
          if(this._stop) return;
          updateCount++;
          drawObject.update();
        }
      }

      // Draw object
      drawObject.draw();
    }
  }

  initializeObjects() {
    this.add(new FlightZone());
    setupDelegate = new UAVManager();
    this.add(setupDelegate);
  }

}
