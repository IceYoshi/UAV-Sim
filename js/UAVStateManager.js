class UAVStateManager{
  constructor(state){
    this.state = state;
  }

  getCurrentState(){
    return this.state;
  }

  goToState(newState){
    this.state = newState;
  }
}
