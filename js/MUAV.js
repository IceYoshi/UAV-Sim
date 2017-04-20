class MUAV extends UAV {

  constructor(radius, position) {
    // radius, position, color, maxSpeed, collisionThreshold, wobblingRadius, communicationRange
    super(radius, position, 'red', 0.8, 80, 200, flightZoneSize/5);
  }

}
