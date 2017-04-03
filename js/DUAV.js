class DUAV extends UAV {

  constructor(drawManager, radius, position) {
    super(radius, position, 'green');

    drawManager.add(this);
  }

}
