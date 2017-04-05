class DUAV extends UAV {

  constructor(drawManager, radius, position) {
    super(radius, position, 'green', 25);

    drawManager.add(this);
  }

}
