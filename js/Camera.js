var cameraTranslation = new p5.Vector(0,0,0);
var cameraRotation = new p5.Vector(0,0);
var cameraScale = 1;
var clickPoint = new p5.Vector(0,0)
function updateCamera() {
  scale(cameraScale);
  rotateX(cameraRotation.x);
  rotateY(cameraRotation.y);
  camera(cameraTranslation.x, cameraTranslation.y, cameraTranslation.z);
}

function mousePressed() {
  clickPoint.set(mouseX, mouseY)
  return false;
}

function mouseDragged() {
  if(mouseButton == LEFT) {
    let cameraRotationDampingFactor = 0.005;
    cameraRotation.add(createVector(
      (mouseY - clickPoint.y),
      (mouseX - clickPoint.x))
      .mult(cameraRotationDampingFactor))
  } else if(mouseButton == RIGHT) {
    cameraTranslation.add(
      (clickPoint.x - mouseX) * cos(cameraRotation.y) - (clickPoint.y - mouseY) * sin(cameraRotation.x) * sin(cameraRotation.y),
      (clickPoint.y - mouseY) * cos(cameraRotation.x),
      (clickPoint.x - mouseX) * sin(cameraRotation.y) + (clickPoint.y - mouseY) * sin(cameraRotation.x) * cos(cameraRotation.y))
  }
  clickPoint.set(mouseX, mouseY)
  return false;
}

function mouseReleased() {
  return false;
}

function mouseWheel(event) {
  let scaleFactor = 1.1;
  if(event.delta > 0) {
    cameraScale /= scaleFactor;
  } else {
    cameraScale *= scaleFactor;
  }
  return false;
}
