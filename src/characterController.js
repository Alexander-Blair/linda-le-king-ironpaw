export default function CharacterController(
  grid,
  gridRenderer,
  documentObject,
  windowObject,
  pageNavigator,
) {
  this._grid = grid;
  this._gridRenderer = gridRenderer;
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
    this.propagateChangesAfterMovement();
    this._gridRenderer.animateLumberjack(direction);

    if (this._grid.isLumberjackInCellWithPinecone()
          && this._grid.lumberjack().canPickUpPineCone()) {
      this._grid.lumberjack().pickUpPineCone();
      this._grid.removePinecone();
      this._gridRenderer.renderPinecones();
      this._windowObject.setTimeout(() => {
        this._grid.spawnPinecone();
        this._gridRenderer.renderPinecones();
      }, 1000);
    }
  },
  handleKeyUp() {
    this._grid.lumberjack().setExploring();
  },
  setupLumberjackMovementListener() {
    this.keyUpListener = () => this.handleKeyUp();
    this.keyDownListener = (e) => this.handleKeyDown(e);
    this._documentObject.addEventListener('keyup', this.keyUpListener);
    this._documentObject.addEventListener('keydown', this.keyDownListener);
  },
  propagateChangesAfterMovement() {
    this._grid.updateStatuses();
    this._gridRenderer.renderLumberjack();
    this._gridRenderer.renderBear();
    this._gridRenderer.updateLifebar();
    if (this._grid.lumberjack().isDead()) this.loseGame();
  },
  setupBearMovementInterval() {
    this._bearMovementInterval = this._windowObject.setInterval(() => {
      const directions = ['up', 'down', 'left', 'right'];
      let bearMoved = false;

      while (!bearMoved) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        if (this._grid.moveBear(direction)) bearMoved = true;
      }
      this._grid.bear().setExploring();
      this.propagateChangesAfterMovement();
    }, this._grid.bear().movementInterval());
  },
  loseGame() {
    this._windowObject.clearInterval(this._bearMovementInterval);
    this._documentObject.removeEventListener('keydown', this.keyDownListener);
    this._documentObject.removeEventListener('keyup', this.keyUpListener);

    this._windowObject.setTimeout(() => {
      this._pageNavigator.showGameOverPage();
      this._gridRenderer.hideCells();
    }, 600);
  },
};
