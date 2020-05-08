export default function CharacterController(
  grid,
  documentObject,
  windowObject,
  pageNavigator,
) {
  this._grid = grid;
  this._documentObject = documentObject;
  this._windowObject = windowObject;
  this._pageNavigator = pageNavigator;
}

CharacterController.prototype = {
  handleKeyDown(e) {
    const direction = {
      38: 'up', 40: 'down', 37: 'left', 39: 'right',
    }[e.keyCode];

    if (direction === undefined) return;

    e.preventDefault();

    this._grid.moveLumberjack(direction);
    this.checkForBearAttack();

    if (!this._grid.pineconePosition()) {
      this._windowObject.setTimeout(() => {
        if (!this._grid.pineconePosition()) this._grid.spawnPinecone();
      }, 1000);
    }
  },
  setupLumberjackMovementListener() {
    this._keyDownListener = (e) => this.handleKeyDown(e);
    this._documentObject.addEventListener('keydown', this._keyDownListener);
  },
  checkForBearAttack() {
    if (this._grid.lumberjack().isDead()) {
      this.loseGame();
      return;
    }
    if (this._grid.isBearAttacking()) {
      this._windowObject.clearInterval(this._bearMovementInterval);
      this.clearKeyListener();
      this._windowObject.setTimeout(() => {
        this._grid.initializeGridPositions();
        this.setupBearMovementInterval();
        this.setupLumberjackMovementListener();
      }, 1000);
    }
  },
  setupBearMovementInterval() {
    this._bearMovementInterval = this._windowObject.setInterval(() => {
      this._grid.moveBear();
      this.checkForBearAttack();
    }, this._grid.bearMovementInterval());
  },
  clearKeyListener() {
    this._documentObject.removeEventListener('keydown', this._keyDownListener);
  },
  loseGame() {
    this._windowObject.clearInterval(this._bearMovementInterval);
    this.clearKeyListener();

    this._windowObject.setTimeout(() => this._pageNavigator.showGameOverPage(), 600);
  },
};
