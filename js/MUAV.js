class MUAV extends UAV {

  constructor(drawManager, radius, position) {
    super(radius, position, 'red');

    drawManager.add(this);
  }

}
