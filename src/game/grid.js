import Lumberjack from './lumberjack';
import GridPosition from './gridPosition';
import containsTree from './utils/containsTree';
import {
  bearAttackLumberjack, moveBear, moveLumberjack, moveFiredPinecone,
  pickUpAvailablePinecone, removeFiredPinecone, spawnBear, spawnAvailablePinecone,
  spawnLumberjack, throwPinecone, updateBearStatus, updateLumberjackStatus,
} from '../redux/actions';
import {
  bearAttacking, bearExploring, bearHurt,
  lumberjackExploring, lumberjackHurt,
} from './statuses';

export default function Grid(gameConfig, store, lumberjackGridPosition, bearGridPosition) {
  this._gameConfig = gameConfig;
  this._store = store;
  this._lumberjackGridPosition = lumberjackGridPosition;
  this._bearGridPosition = bearGridPosition;

  this._treePositions = gameConfig.treePositions;
  this._availablePineconePosition = gameConfig.initialPineconePosition;
  this._score = 0;

  this._lumberjack = new Lumberjack(
    this._gameConfig.lumberjackStartingLives,
    this._gameConfig.lumberjackMaxPinecones,
  );
  this.initializeGridPositions();
}

Grid.prototype = {
  initializeGridPositions() {
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
      ),
    );
  },
  bearMovementInterval() { return this._gameConfig.bearStartSpeed; },
  score() { return this._score; },
  isBearAttacking() {
    const bearPosition = this._bearGridPosition.getCurrentPosition();
    const lumberjackPosition = this._lumberjackGridPosition.getCurrentPosition();

    return bearPosition[0] === lumberjackPosition[0] && bearPosition[1] === lumberjackPosition[1];
  },
  isBearHit() {
    if (this._isBearHit) return true;
    if (!this._firedPineconeGridPosition) return false;

    const bearPosition = this._bearGridPosition.getCurrentPosition();
    const firedPineconePosition = this._firedPineconeGridPosition.getCurrentPosition();

    this._isBearHit = bearPosition[0] === firedPineconePosition[0]
      && bearPosition[1] === firedPineconePosition[1];
    return this._isBearHit;
  },
  lumberjack() { return this._lumberjack; },
  availablePineconePosition() { return this._availablePineconePosition; },
  moveBear() {
    this._isBearHit = false;
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
      this.removeAvailablePinecone();
    }
    return true;
  },
  checkForBearHit() {
    if (this.isBearHit()) this._store.dispatch(updateBearStatus(bearHurt));
  },
  checkForBearAttack() {
    if (this.isBearHit()) return;

    if (this.isBearAttacking()) {
      this._lumberjack.loseLife();
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
  generateRandomPosition() {
    const numberOfCells = this._gameConfig.gridHeight * this._gameConfig.gridWidth;
    const index = Math.floor(Math.random() * numberOfCells);

    return [parseInt(index / this._gameConfig.gridWidth, 10), index % this._gameConfig.gridWidth];
  },
  spawnPinecone() {
    let pineconePosition = this.generateRandomPosition();

    while (containsTree(this._treePositions, pineconePosition)) {
      pineconePosition = this.generateRandomPosition();
    }
    this._availablePineconePosition = pineconePosition;
    this._store.dispatch(
      spawnAvailablePinecone(...this.availablePineconePosition(), this._gameConfig.gridWidth),
    );
  },
  removeAvailablePinecone() {
    this._store.dispatch(pickUpAvailablePinecone());
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
