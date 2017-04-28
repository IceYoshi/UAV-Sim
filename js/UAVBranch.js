class UAVBranch {

  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value || 0;
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value || 0;
  }
  get head() {
    return this._head;
  }
  set head(value) {
    this._head = value || null;
    this._length = value ? 1 : 0;
  }

  constructor(color) {
    this._head = null;
    this._color = color;
    this._length = 0;
  }

}
