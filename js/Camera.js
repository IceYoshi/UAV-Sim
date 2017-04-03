var cameraOffset = new p5.Vector(0,0);
var cameraScale = 1;
function updateCamera() {
  let dampingFactor = 0.005;
  rotateX((dragDistance.x + cameraOffset.x) * dampingFactor);
  rotateY((dragDistance.y + cameraOffset.y) * dampingFactor);
  scale(cameraScale);
  camera(0, 0, 0);
}

var clickPoint = new p5.Vector(0,0);
function mousePressed() {
  clickPoint.set(mouseX, mouseY);
}

var dragDistance = new p5.Vector(0,0);
function mouseDragged() {
  dragDistance.set(mouseY - clickPoint.y, mouseX - clickPoint.x);
}

function mouseReleased() {
  cameraOffset.add(dragDistance);
  dragDistance.set(0,0);
}

function mouseWheel(event) {
  let scaleFactor = 1.1;
  if(event.delta > 0) {
    cameraScale /= scaleFactor;
  } else {
    cameraScale *= scaleFactor;
  }
  return false; // Prevent page from scrolling
}
