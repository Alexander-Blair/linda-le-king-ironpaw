import { Bear } from './bear';
import GridPosition from './gridPosition';
import { Lumberjack } from './lumberjack';
import containsTree from './utils/containsTree';

export default function Grid(gameConfig) {
  this._width = gameConfig.gridWidth;
  this._height = gameConfig.gridHeight;
  this._lumberjack = new Lumberjack(gameConfig.lumberjackStartingLives);
  this._bear = new Bear(gameConfig.bearStartSpeed);
  this._gameConfig = gameConfig;
  this._treePositions = gameConfig.treePositions;
  this._pineconePosition = gameConfig.initialPineconePosition;
  this._score = 0;
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
  },
  treePositions() { return this._treePositions; },
  score() { return this._score; },
  height() { return this._height; },
  width() { return this._width; },
  numberOfCells() { return this._height * this._width; },
  isBearAttacking() {
    return this._bearGridPosition.getCurrentCellIndex()
      === this._lumberjackGridPosition.getCurrentCellIndex();
  },
  bearGridPosition() { return this._bearGridPosition; },
  lumberjackGridPosition() { return this._lumberjackGridPosition; },
  lumberjack() { return this._lumberjack; },
  bear() { return this._bear; },
  pineconePosition() { return this._pineconePosition; },
  lastPineconePosition() { return this._lastPineconePosition; },
  moveBear() {
    const nextPosition = this._bearGridPosition.nextPosition(
      this._lumberjackGridPosition.getCurrentPosition(),
    );
    const bearPosition = this._bearGridPosition.getCurrentPosition();
    const currentXCoord = bearPosition[0];
    const currentYCoord = bearPosition[1];
    const newXCoord = nextPosition[0];
    const newYCoord = nextPosition[1];
    let direction;

    if (newXCoord < currentXCoord) direction = 'left';
    else if (newXCoord > currentXCoord) direction = 'right';
    else if (newYCoord < currentYCoord) direction = 'up';
    else direction = 'down';

    this.bearGridPosition().move(direction);
    this.updateStatuses();
  },
  moveLumberjack(direction) {
    this._lumberjack.setExploring();

    if (!this.lumberjackGridPosition().canMove(direction)) return;

    this.lumberjackGridPosition().move(direction);
    this.updateStatuses();

    if (this.isLumberjackInCellWithPinecone() && this._lumberjack.canPickUpPineCone()) {
      this._lumberjack.pickUpPineCone();
      this.removePinecone();
    }
  },
  updateStatuses() {
    if (!this.isBearAttacking()) return;

    this._lumberjack.setHurt();
    this._bear.setAttacking();
    this._lumberjack.loseLife();
  },
  isLumberjackInCellWithPinecone() {
    if (!this.pineconePosition()) return false;

    const lumberjackPosition = this._lumberjackGridPosition.getCurrentPosition();

    return lumberjackPosition[0] === this.pineconePosition()[0]
      && lumberjackPosition[1] === this.pineconePosition()[1];
  },
  generateRandomPosition() {
    const index = Math.floor(Math.random() * this.numberOfCells());

    return [parseInt(index / this._width, 10), index % this._width];
  },
  spawnPinecone() {
    let pineconePosition = this.generateRandomPosition();

    while (containsTree(this._treePositions, pineconePosition)) {
      pineconePosition = this.generateRandomPosition();
    }
    this._pineconePosition = pineconePosition;
  },
  removePinecone() {
    this._lastPineconePosition = this._pineconePosition;
    this._pineconePosition = null;
  },
};
