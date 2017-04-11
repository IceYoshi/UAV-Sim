class UAV{

  constructor(v, w, h){
    this.v = v;

    this.w = w;
    this.h = h;
  }

  draw(){
    noFill();
    stroke(255);
    push(); // Start a new drawing state
    translate(this.v.x, this.v.y, this.v.z);
    sphere(this.w);
    pop();  // Restore original state
  }
}
