import GridPosition from './gridPosition';
import { Lumberjack } from './lumberjack';
import containsTree from './utils/containsTree';
import {
  bearAttackLumberjack,
  moveBear,
  moveLumberjack,
  pickUpPinecone,
  spawnBear,
  spawnPinecone,
  spawnLumberjack,
  updateBearStatus,
  updateLumberjackStatus,
} from '../redux/actions';
import {
  bearAttacking, bearExploring,
  lumberjackExploring, lumberjackHurt,
} from './statuses';

export default function Grid(gameConfig, store) {
  this._gameConfig = gameConfig;
  this._treePositions = gameConfig.treePositions;
  this._pineconePosition = gameConfig.initialPineconePosition;
  this._score = 0;
  this._store = store;

  this._lumberjack = new Lumberjack(this._gameConfig.lumberjackStartingLives);
  this.initializeGridPositions();
}

Grid.prototype = {
  initializeGridPositions() {
    this._lumberjackGridPosition = new GridPosition(
      this._gameConfig.lumberjackStartingXCoordinate,
      this._gameConfig.lumberjackStartingYCoordinate,
      this._gameConfig.gridWidth,
      this._gameConfig.gridHeight,
      this._gameConfig.treePositions,
    );
    this._bearGridPosition = new GridPosition(
      this._gameConfig.bearStartingXCoordinate,
      this._gameConfig.bearStartingYCoordinate,
      this._gameConfig.gridWidth,
      this._gameConfig.gridHeight,
      this._gameConfig.treePositions,
    );
    this._store.dispatch(
      spawnBear(
        ...this._bearGridPosition.getCurrentPosition(),
        bearExploring,
        this._gameConfig.gridWidth,
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
  lumberjack() { return this._lumberjack; },
  pineconePosition() { return this._pineconePosition; },
  moveBear() {
    let direction;

    const [newXCoord, newYCoord] = this._bearGridPosition.nextPosition(
      this._lumberjackGridPosition.getCurrentPosition(),
    );
    const [currentXCoord, currentYCoord] = this._bearGridPosition.getCurrentPosition();

    if (newXCoord < currentXCoord) direction = 'left';
    else if (newXCoord > currentXCoord) direction = 'right';
    else if (newYCoord < currentYCoord) direction = 'up';
    else direction = 'down';

    this._bearGridPosition.move(direction);
    this._store.dispatch(
      moveBear(...this._bearGridPosition.getCurrentPosition(), this._gameConfig.gridWidth),
    );
    this.updateStatuses();
  },
  moveLumberjack(direction) {
    if (!this._lumberjackGridPosition.canMove(direction)) return;

    this._lumberjackGridPosition.move(direction);
    this._store.dispatch(moveLumberjack(
      ...this._lumberjackGridPosition.getCurrentPosition(),
      this._gameConfig.gridWidth,
      direction,
    ));
    this.updateStatuses();

    if (this.isLumberjackInCellWithPinecone() && this._lumberjack.canPickUpPineCone()) {
      this._lumberjack.pickUpPineCone();
      this.removePinecone();
      this._store.dispatch(pickUpPinecone());
    }
  },
  updateStatuses() {
    if (!this.isBearAttacking()) return;

    this._lumberjack.loseLife();
    this._store.dispatch(bearAttackLumberjack(this._lumberjack.numberOfLives()));
    this._store.dispatch(updateBearStatus(bearAttacking));
    this._store.dispatch(updateLumberjackStatus(lumberjackHurt));
  },
  isLumberjackInCellWithPinecone() {
    if (!this.pineconePosition()) return false;

    const lumberjackPosition = this._lumberjackGridPosition.getCurrentPosition();

    return lumberjackPosition[0] === this.pineconePosition()[0]
      && lumberjackPosition[1] === this.pineconePosition()[1];
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
    this._pineconePosition = pineconePosition;
    this._store.dispatch(spawnPinecone(...this.pineconePosition(), this._gameConfig.gridWidth));
  },
  removePinecone() { this._pineconePosition = null; },
};
