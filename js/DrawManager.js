class DrawManager {

  get paused() {
    return this._paused;
  }
  set paused(value) {
    this._paused = value;
  }

  constructor() {
    this.drawBuffer = [];
    this._paused = false;
  }

  add(drawable) {
    this.drawBuffer.push(drawable);
    return drawable; // Useful for chaining
  }

  draw() {
    for(let i = 0; i < this.drawBuffer.length; i++) {
      let drawObject = this.drawBuffer[i];

      // Update object if needed
      if(!this._paused && typeof drawObject.update === 'function') {
        drawObject.update();
      }

      // Draw object
      drawObject.draw();
    }
  }

}
