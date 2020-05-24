export default function CharacterController(
  grid, documentObject, windowObject, pageNavigator, gameConfig,
) {
  this._grid = grid;
  this._documentObject = documentObject;
  this._windowObject = windowObject;
  this._pageNavigator = pageNavigator;
  this._gameConfig = gameConfig;
}

const PINECONE_INTERVAL = 100;
const directionMappings = {
  38: 'up', 40: 'down', 37: 'left', 39: 'right',
};

CharacterController.prototype = {
  startGame() {
    this.setupLumberjackMovementListener();
    this.setupBearMovementInterval();
    this.setupPineconeSpawnInterval();
  },
  handleKeyDown(e) {
    e.stopPropagation();
    if (Object.keys(directionMappings).includes(String(e.keyCode))) {
      this.handleLumberjackMovement(e);
    }
    if (e.keyCode === 32) this.handlePineconeThrow();
  },
  setupTimerInterval() {
    let seconds = 0;

    this._timerInterval = this._windowObject.setInterval(() => {
      if (seconds >= this._gameConfig.roundLengthSeconds) {
        this._isGamePaused = true;
        this.clearListenersAndInvervals();
        this._windowObject.setTimeout(() => {
          this._isGamePaused = false;
          this._grid.nextRound();
          this.startListenersAndIntervals();
        }, 5000);
        return;
      }

      if (seconds % 10 === 0) this._grid.incrementScoreFromTime();
      seconds += 1;
    }, 1000);
  },
  handlePineconeThrow() {
    if (!this._grid.throwPinecone()) return;

    this._pineconeTravelInterval = this._windowObject.setInterval(() => {
      if (this._grid.movePinecone()) {
        this.checkForAttacks();
      } else {
        this._windowObject.clearInterval(this._pineconeTravelInterval);
        this._windowObject.setTimeout(() => {
          this._grid.removeFiredPinecone();
        }, PINECONE_INTERVAL);
      }
    }, PINECONE_INTERVAL);
  },
  handleLumberjackMovement(e) {
    const direction = directionMappings[e.keyCode];

    if (!direction || !this._grid.moveLumberjack(direction)) return;

    this.checkForAttacks();
  },
  setupPineconeSpawnInterval() {
    this._spawnPineconeInterval = this._windowObject.setInterval(() => {
      if (!this._grid.availablePineconePosition()) {
        this._windowObject.setTimeout(() => {
          if (!this._grid.availablePineconePosition()) this._grid.spawnPinecone();
        }, 1000);
      }
    }, 200);
  },
  setupLumberjackMovementListener() {
    this._keyDownListener = (e) => this.handleKeyDown(e);
    this._documentObject.addEventListener('keydown', this._keyDownListener);
  },
  checkForAttacks() {
    if (this._grid.lumberjack().isDead()) {
      this.loseGame();
    } else if (this._grid.isBearHit() && !this._clearingBearInverval) {
      this._clearingBearInverval = true;
      this._windowObject.clearInterval(this._pineconeTravelInterval);
      this._windowObject.setTimeout(() => { this._grid.removeFiredPinecone(); }, 300);
      this._windowObject.clearInterval(this._bearMovementInterval);

      this._windowObject.setTimeout(() => {
        this._windowObject.clearInterval(this._bearMovementInterval);
        this.setupBearMovementInterval();
      }, 2000);
    } else if (
      this._grid.isBearAttacking() && !this._grid.isBearHit() && !this._clearingBearInverval
    ) {
      this._clearingBearInverval = true;

      this._windowObject.clearInterval(this._bearMovementInterval);
      this._windowObject.clearInterval(this._spawnPineconeInterval);
      this.clearKeyListener();

      this._windowObject.setTimeout(() => {
        this._grid.initializeGridPositions();
        this.setupBearMovementInterval();
        this.setupLumberjackMovementListener();
        this.setupPineconeSpawnInterval();
      }, 1000);
    }
  },
  setupBearMovementInterval() {
    this._bearMovementInterval = this._windowObject.setInterval(() => {
      this._grid.moveBear();
      this._clearingBearInverval = false;
      this.checkForAttacks();
    }, this._grid.bearMovementInterval());
  },
  clearKeyListener() {
    this._documentObject.removeEventListener('keydown', this._keyDownListener);
  },
  loseGame() {
    this._windowObject.clearInterval(this._bearMovementInterval);
    this._windowObject.clearInterval(this._pineconeTravelInterval);
    this._windowObject.clearInterval(this._spawnPineconeInterval);
    this.clearKeyListener();

    this._windowObject.setTimeout(() => this._pageNavigator.showGameOverPage(), 600);
  },
};
