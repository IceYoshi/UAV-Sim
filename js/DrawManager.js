class DrawManager {

  constructor() {
    this.drawBuffer = [];
  }

  add(drawable) {
    this.drawBuffer.push(drawable);
  }

  draw() {
    for(let i = 0; i < this.drawBuffer.length; ++i) {
      this.drawBuffer[i].draw();
    }
  }

}
