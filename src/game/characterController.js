import {
  PAUSED, BEAR_HIT, LUMBERJACK_HURT, GAME_OVER,
} from './gameStatuses';

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
const PINECONE_DISAPPEARANCE_TIME = 300;
const ROUND_PAUSE_TIME = 3000;
const directionMappings = {
  38: 'up', 40: 'down', 37: 'left', 39: 'right',
};

CharacterController.prototype = {
  scheduleNextRound() {
    this._windowObject.setTimeout(() => {
      this._attackInProgress = false;
      this._grid.nextRound();
      this.startListenersAndIntervals();
    }, ROUND_PAUSE_TIME);
  },
  schedule(callback, delay) {
    if (this._grid.gameStatus() === PAUSED) return;

    this._windowObject.setTimeout(() => {
      if (this._grid.gameStatus() === PAUSED) return;

      callback();
    }, delay);
  },
  startListenersAndIntervals() {
    this.setupLumberjackMovementListener();
    this.setupBearMovementInterval();
    this.setupPineconeSpawnInterval();
    this.setupTimerInterval();
  },
  handleKeyDown(e) {
    e.stopPropagation();
    if (Object.keys(directionMappings).includes(String(e.keyCode))) {
      this.handleLumberjackMovement(e);
    }
    if (e.keyCode === 32) this.handlePineconeThrow();
  },
  setupTimerInterval() {
    this._timerInterval = this._windowObject.setInterval(() => {
      this._grid.incrementSeconds();
      this.checkForStatusChange();
    }, 1000);
  },
  removeFiredPinecone() {
    this._windowObject.clearInterval(this._pineconeTravelInterval);
    this._windowObject.setTimeout(() => {
      this._grid.removeFiredPinecone();
    }, PINECONE_DISAPPEARANCE_TIME);
  },
  handlePineconeThrow() {
    if (!this._grid.throwPinecone()) return;

    this._pineconeTravelInterval = this._windowObject.setInterval(() => {
      if (!this._grid.movePinecone()) {
        this.removeFiredPinecone();
      } else this.checkForStatusChange();
    }, PINECONE_INTERVAL);
  },
  handleLumberjackMovement(e) {
    const direction = directionMappings[e.keyCode];

    if (!direction || !this._grid.moveLumberjack(direction)) return;

    this.checkForStatusChange();
  },
  setupPineconeSpawnInterval() {
    this._spawnPineconeInterval = this._windowObject.setInterval(() => {
      if (!this._grid.availablePineconePosition()) this._grid.spawnPinecone();
    }, 500);
  },
  setupLumberjackMovementListener() {
    this._keyDownListener = (e) => this.handleKeyDown(e);
    this._documentObject.addEventListener('keydown', this._keyDownListener);
  },
  checkForStatusChange() {
    switch (this._grid.gameStatus()) {
      case GAME_OVER:
        this.loseGame();
        break;
      case PAUSED:
        this.clearListenersAndInvervals();
        this.scheduleNextRound();
        break;
      case BEAR_HIT:
        if (this._attackInProgress) return;
        this._attackInProgress = true;
        this.removeFiredPinecone();
        this._windowObject.clearInterval(this._bearMovementInterval);

        this.schedule(() => {
          this._attackInProgress = false;
          this._windowObject.clearInterval(this._bearMovementInterval);
          this.setupBearMovementInterval();
        }, 2000);
        break;
      case LUMBERJACK_HURT:
        if (this._attackInProgress) return;
        this._attackInProgress = true;

        this._windowObject.clearInterval(this._bearMovementInterval);
        this._windowObject.clearInterval(this._spawnPineconeInterval);
        this.clearKeyListener();

        this.schedule(() => {
          this._attackInProgress = false;
          this._grid.initializeGridPositions();
          this.setupBearMovementInterval();
          this.setupLumberjackMovementListener();
          this.setupPineconeSpawnInterval();
        }, 1000);
        break;
      default:
        break;
    }
  },
  moveBear() {
    this._grid.moveBear();
    this.checkForStatusChange();
  },
  setupBearMovementInterval() {
    this.moveBear();
    this._bearMovementInterval = this._windowObject.setInterval(() => {
      this.moveBear();
    }, this._grid.bearMovementInterval());
  },
  clearKeyListener() {
    this._documentObject.removeEventListener('keydown', this._keyDownListener);
  },
  clearListenersAndInvervals() {
    this._windowObject.clearInterval(this._bearMovementInterval);
    this.removeFiredPinecone();
    this._windowObject.clearInterval(this._spawnPineconeInterval);
    this._windowObject.clearInterval(this._timerInterval);
    this.clearKeyListener();
  },
  loseGame() {
    this.clearListenersAndInvervals();

    this._windowObject.setTimeout(() => this._pageNavigator.showGameOverPage(), 600);
  },
};
