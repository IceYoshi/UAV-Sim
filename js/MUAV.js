class MUAV extends UAV {

  constructor(drawManager, radius, position) {
    super(radius, position, 'red', 150);
    drawManager.add(this);
  }

}
