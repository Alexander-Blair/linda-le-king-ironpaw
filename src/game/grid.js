import Lumberjack from './lumberjack';
import GridPosition from './gridPosition';
import containsTree from './utils/containsTree';
import generateRandomPosition from './utils/generateRandomPosition';
import {
  bearAttackLumberjack, moveBear, moveLumberjack, moveFiredPinecone,
  pickUpAvailablePinecone, removeFiredPinecone, spawnBear, spawnAvailablePinecone,
  spawnLumberjack, throwPinecone, updateBearStatus,
  updateLumberjackStatus, updateRoundNumber, updateScore,
  updateSecondsRemaining,
} from '../redux/actions';
import {
  bearAttacking, bearExploring, bearHurt,
  lumberjackExploring, lumberjackHurt,
} from './characterStatuses';
import {
  PLAYING, PAUSED, BEAR_HIT, LUMBERJACK_HURT, GAME_OVER,
} from './gameStatuses';

export default function Grid(gameConfig, store, lumberjackGridPosition, bearGridPosition) {
  this._gameConfig = gameConfig;
  this._store = store;
  this._lumberjackGridPosition = lumberjackGridPosition;
  this._bearGridPosition = bearGridPosition;

  this._treePositions = gameConfig.treePositions;
  this._availablePineconePosition = gameConfig.initialPineconePosition;
  this._score = 0;
  this._roundNumber = 1;
  this._secondsRemaining = this._gameConfig.roundLengthSeconds;

  this._lumberjack = new Lumberjack(
    this._gameConfig.lumberjackStartingLives,
    this._gameConfig.lumberjackMaxPinecones,
  );
  this.initializeGridPositions();
}

Grid.prototype = {
  initializeGridPositions() {
    this._gameStatus = PLAYING;
    this._lumberjackGridPosition.reset();
    this._bearGridPosition.reset();
    this._store.dispatch(
      spawnBear(
        ...this._bearGridPosition.getCurrentPosition(), bearExploring, this._gameConfig.gridWidth,
      ),
    );
    this._store.dispatch(
      spawnLumberjack(
        ...this._lumberjackGridPosition.getCurrentPosition(),
        this._lumberjack.numberOfLives(),
        lumberjackExploring,
        this._gameConfig.gridWidth,
        this._gameConfig.lumberjackMaxPinecones,
      ),
    );
    this._store.dispatch(updateSecondsRemaining(this._secondsRemaining));
  },
  bearMovementInterval() {
    const i = this._gameConfig.bearStartSpeed - (this._roundNumber - 1) * 15;
    return i;
  },
  incrementSeconds() {
    if (this._secondsRemaining <= 0) {
      this._gameStatus = PAUSED;
    } else {
      this._store.dispatch(updateSecondsRemaining(this._secondsRemaining));
      this._secondsRemaining -= 1;
    }
  },
  gameStatus() { return this._gameStatus; },
  score() { return this._score; },
  nextRound() {
    this.initializeGridPositions();
    this._secondsRemaining = this._gameConfig.roundLengthSeconds;
    this._roundNumber += 1;
    this._store.dispatch(updateRoundNumber(this._roundNumber));
  },
  incrementScoreFromTime() {
    this._score += 10 * this._roundNumber;
    this._store.dispatch(updateScore(this._score));
  },
  isBearAttacking() {
    const bearPosition = this._bearGridPosition.getCurrentPosition();
    const lumberjackPosition = this._lumberjackGridPosition.getCurrentPosition();

    return bearPosition[0] === lumberjackPosition[0] && bearPosition[1] === lumberjackPosition[1];
  },
  isBearHit() {
    if (!this._firedPineconeGridPosition) return false;

    const bearPosition = this._bearGridPosition.getCurrentPosition();
    const firedPineconePosition = this._firedPineconeGridPosition.getCurrentPosition();

    return bearPosition[0] === firedPineconePosition[0]
      && bearPosition[1] === firedPineconePosition[1];
  },
  lumberjack() { return this._lumberjack; },
  availablePineconePosition() { return this._availablePineconePosition; },
  moveBear() {
    this._gameStatus = PLAYING;
    const [newXCoord, newYCoord] = this._bearGridPosition.nextPosition(
      this._lumberjackGridPosition.getCurrentPosition(),
    );

    this._bearGridPosition.moveTo(newXCoord, newYCoord);
    this._store.dispatch(updateBearStatus(bearExploring));
    this._store.dispatch(
      moveBear(...this._bearGridPosition.getCurrentPosition(), this._gameConfig.gridWidth),
    );
    this.checkForBearAttack();
    this.checkForBearHit();
  },
  moveLumberjack(direction) {
    if (!this._lumberjackGridPosition.canMove(direction)) return false;

    this._lumberjack.updateDirection(direction);
    this._lumberjackGridPosition.move(direction);
    this._store.dispatch(moveLumberjack(
      ...this._lumberjackGridPosition.getCurrentPosition(),
      this._gameConfig.gridWidth,
      direction,
    ));
    this.checkForBearAttack();

    if (this.isLumberjackInCellWithPinecone() && this._lumberjack.canPickUpPineCone()) {
      this._lumberjack.pickUpPineCone();
      this._store.dispatch(pickUpAvailablePinecone(this._lumberjack.numberOfPinecones()));
      this.removeAvailablePinecone();
    }
    return true;
  },
  checkForBearHit() {
    if (this._gameStatus === BEAR_HIT) return;

    if (this.isBearHit()) {
      this._gameStatus = BEAR_HIT;
      this._store.dispatch(updateBearStatus(bearHurt));
      this._score += 50 * this._roundNumber;
      this._store.dispatch(updateScore(this._score));
    }
  },
  checkForBearAttack() {
    if (this._gameStatus === BEAR_HIT) return;

    if (this.isBearAttacking()) {
      this._gameStatus = LUMBERJACK_HURT;
      this._lumberjack.loseLife();
      if (this._lumberjack.isDead()) this._gameStatus = GAME_OVER;

      this._store.dispatch(bearAttackLumberjack(this._lumberjack.numberOfLives()));
      this._store.dispatch(updateBearStatus(bearAttacking));
      this._store.dispatch(updateLumberjackStatus(lumberjackHurt));
    }
  },
  isLumberjackInCellWithPinecone() {
    if (!this.availablePineconePosition()) return false;

    const lumberjackPosition = this._lumberjackGridPosition.getCurrentPosition();

    return lumberjackPosition[0] === this.availablePineconePosition()[0]
      && lumberjackPosition[1] === this.availablePineconePosition()[1];
  },
  spawnPinecone() {
    let pineconePosition = generateRandomPosition(
      this._gameConfig.gridWidth,
      this._gameConfig.gridHeight,
    );

    while (containsTree(this._treePositions, pineconePosition)) {
      pineconePosition = generateRandomPosition(
        this._gameConfig.gridWidth,
        this._gameConfig.gridHeight,
      );
    }
    this._availablePineconePosition = pineconePosition;
    this._store.dispatch(
      spawnAvailablePinecone(...this.availablePineconePosition(), this._gameConfig.gridWidth),
    );
  },
  removeAvailablePinecone() {
    this._availablePineconePosition = null;
  },
  removeFiredPinecone() {
    this._store.dispatch(removeFiredPinecone());
    this._firedPineconeGridPosition = null;
  },
  throwPinecone() {
    if (!this._lumberjack.canThrowPineCone() || this._firedPineconeGridPosition) return false;

    this._lumberjack.throwPineCone();
    this._firedPineconeSquaresTravelled = 0;
    this._firedPineconeDirection = this._lumberjack.direction();
    this._firedPineconeGridPosition = new GridPosition(
      this._lumberjackGridPosition.getCurrentPosition(),
      this._gameConfig.gridWidth,
      this._gameConfig.gridHeight,
      this._gameConfig.treePositions,
    );
    this._store.dispatch(
      throwPinecone(
        ...this._firedPineconeGridPosition.getCurrentPosition(),
        this._firedPineconeDirection,
        this._gameConfig.gridWidth,
        this._lumberjack.numberOfPinecones(),
      ),
    );

    if (this._firedPineconeGridPosition.canMove(this._firedPineconeDirection)) this.movePinecone();
    return true;
  },
  movePinecone() {
    if (this._firedPineconeSquaresTravelled >= 5 || this.isBearHit()) return false;

    const direction = this._firedPineconeDirection;
    if (this._firedPineconeGridPosition.canMove(direction)) {
      this._firedPineconeGridPosition.move(direction);
      this._store.dispatch(
        moveFiredPinecone(
          ...this._firedPineconeGridPosition.getCurrentPosition(),
          this._gameConfig.gridWidth,
        ),
      );
      this._firedPineconeSquaresTravelled += 1;
      this.checkForBearHit();
      return true;
    }
    return false;
  },
};
