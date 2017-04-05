class DrawManager {

  constructor() {
    this.drawBuffer = [];
  }

  add(drawable) {
    this.drawBuffer.push(drawable);
  }

  draw() {
    for(let i = 0; i < this.drawBuffer.length; ++i) {
      let drawObject = this.drawBuffer[i];

      // Update object if needed
      if(typeof drawObject.update === 'function') {
        drawObject.update();
      }

      // Draw object
      drawObject.draw();
    }
  }

}
