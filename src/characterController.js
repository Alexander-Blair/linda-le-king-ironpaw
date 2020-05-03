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

    const numberOfPineconesBefore = this._grid.lumberjack().numberOfPinecones();

    this._grid.moveLumberjack(direction);
    this.render();
    this._gridRenderer.animateLumberjack(direction);

    if (this._grid.lumberjack().numberOfPinecones() > numberOfPineconesBefore) {
      this._windowObject.setTimeout(() => {
        this._grid.spawnPinecone();
        this._gridRenderer.render();
      }, 1000);
    }
  },
  handleKeyUp() { this._grid.lumberjack().setExploring(); },
  setupLumberjackMovementListener() {
    this._keyUpListener = () => this.handleKeyUp();
    this._keyDownListener = (e) => this.handleKeyDown(e);
    this._documentObject.addEventListener('keyup', this._keyUpListener);
    this._documentObject.addEventListener('keydown', this._keyDownListener);
  },
  render() {
    if (this._grid.lumberjack().isDead()) {
      this._gridRenderer.render();
      this.loseGame();
      return;
    }
    if (this._grid.isBearAttacking()) {
      this._windowObject.clearInterval(this._bearMovementInterval);
      this.clearKeyListeners();
      this._grid.lumberjack().setExploring();
      this._windowObject.setTimeout(() => {
        this._gridRenderer.removeCharacters();
        this._grid.initializeGridPositions();
        this.setupBearMovementInterval();
        this.setupLumberjackMovementListener();
      }, 1000);
    }

    this._gridRenderer.render();
  },
  setupBearMovementInterval() {
    this._bearMovementInterval = this._windowObject.setInterval(() => {
      this._grid.bear().setExploring();
      this._grid.moveBear();
      this.render();
    }, this._grid.bear().movementInterval());
  },
  clearKeyListeners() {
    this._documentObject.removeEventListener('keydown', this._keyDownListener);
    this._documentObject.removeEventListener('keyup', this._keyUpListener);
  },
  loseGame() {
    this._windowObject.clearInterval(this._bearMovementInterval);
    this.clearKeyListeners();

    this._windowObject.setTimeout(() => {
      this._pageNavigator.showGameOverPage();
      this._gridRenderer.hideCells();
    }, 600);
  },
};
