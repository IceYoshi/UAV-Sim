class MathHelper{

  static rotateVaboutK(v, k, theta) {
      let kCrossV = MathHelper.crossProduct(k, v);
      let kDotV = MathHelper.dotProduct(k, v);

      let r1 = v.mult(cos(theta));
      let r2 = r1.add(kCrossV.mult(sin(theta)));
      let r3 = r2.add(k.mult(kDotV).mult(1 - cos(theta)));

      return r3;
    }

  static crossProduct(vec1, vec2) {
    return createVector((vec1.y * vec2.z) - (vec1.z * vec2.y),
                           (vec1.z * vec2.x) - (vec1.x * vec2.z),
                           (vec1.x * vec2.y) - (vec1.y * vec2.x)).normalize();
  }

  static dotProduct(vec1, vec2) {
    return      (vec1.x * vec2.x)
              + (vec1.y * vec2.y)
              + (vec1.z * vec2.z);
  }
}
