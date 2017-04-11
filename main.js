
var cluster;

function setup() {
  cluster = new Cluster(6);
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  camera(cos(frameCount * 0.01) * 100,
          cos(frameCount * 0.01) * 200,
          -sin(frameCount * 0.01) * 200);
  background("#e7e7e7");

  if(mouseIsPressed){orbitControl();}

  cluster.draw();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
