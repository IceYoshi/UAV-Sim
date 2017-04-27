var cameraTranslation = new p5.Vector(0,0,0);
var cameraRotation = new p5.Vector(0,0);
var cameraScale = 1;
var clickPoint = new p5.Vector(0,0)
function updateCamera() {
  scale(cameraScale);
  translate(cameraTranslation.x, cameraTranslation.y, cameraTranslation.z);
  rotateX(cameraRotation.x);
  rotateY(cameraRotation.y);
  camera(0,0,0);
}

function mousePressed() {
  if(cameraControlEnabled) {
    clickPoint.set(mouseX, mouseY);
  }
}

function mouseDragged() {
  if(cameraControlEnabled) {
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

function mouseReleased() {}

function mouseWheel(event) {
  let scaleFactor = 1.1;
  if(event.delta > 0) {
    cameraScale = max(0.25, cameraScale / scaleFactor);
  } else {
    cameraScale = min(4, cameraScale * scaleFactor);
  }
  return false;
}
