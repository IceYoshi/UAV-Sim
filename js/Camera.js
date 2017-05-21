var cameraTranslation = new p5.Vector(0,0,0);
var cameraRotation = new p5.Vector(0,0);
var cameraScale = 1;
var clickPoint = new p5.Vector(0,0);
var canvasFocus = false;
var canvasHover = false;

function updateCamera() {
  scale(cameraScale);
  translate(cameraTranslation.x, cameraTranslation.y, cameraTranslation.z);
  rotateX(cameraRotation.x);
  rotateY(cameraRotation.y);
  camera(0,0,0);
}

// called when mousePressed is fired INSIDE canvas
var canvasMousePressed = function(){
  canvasFocus = true;
  clickPoint.set(mouseX, mouseY);
}

var canvasMouseOver = function(){
  canvasHover = true;
}

var canvasMouseOut = function(){
  canvasHover = false;
}

function mouseDragged(){
  if(canvasFocus) {
    let dx = clickPoint.x - mouseX;
    let dy = clickPoint.y - mouseY;
    if(mouseButton == LEFT) {
      let cameraRotationDampingFactor = 0.005;
      cameraRotation.sub(
        createVector(dy, dx).mult(cameraRotationDampingFactor)
      );
    } else if(mouseButton == RIGHT) {
      cameraTranslation.sub(createVector(dx, dy, 0).div(cameraScale));
    }
    clickPoint.set(mouseX, mouseY);
  }
}

function mouseReleased(){
  canvasFocus = false;
}

function mouseWheel(event){
  if (canvasHover){
    let scaleFactor = 1.1;
    if(event.delta > 0) {
      cameraScale = max(0.25, cameraScale / scaleFactor);
    } else {
      cameraScale = min(4, cameraScale * scaleFactor);
    }
    return false;
  }
}
