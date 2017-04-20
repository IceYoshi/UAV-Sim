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
  let dx = clickPoint.x - mouseX;
  let dy = clickPoint.y - mouseY
  if(mouseButton == LEFT) {
    let cameraRotationDampingFactor = 0.005;
    cameraRotation.add(createVector(-dy, -dx)
      .mult(cameraRotationDampingFactor))
  } else if(mouseButton == RIGHT) {
    cameraTranslation.add(
      dx * cos(cameraRotation.y) - dy * sin(cameraRotation.x) * sin(cameraRotation.y),
      dy * cos(cameraRotation.x),
      dx * sin(cameraRotation.y) + dy * sin(cameraRotation.x) * cos(cameraRotation.y))
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
