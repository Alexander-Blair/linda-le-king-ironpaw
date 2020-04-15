import { Bear } from './bear';
import GridPosition from './gridPosition';
import { Lumberjack } from './lumberjack';

export default function Grid(gameConfig) {
  this._width = gameConfig.gridWidth;
  this._height = gameConfig.gridHeight;
  this._lumberjack = new Lumberjack(gameConfig.lumberjackStartingLives);
  this._bear = new Bear(gameConfig.bearStartSpeed);
  this._gameConfig = gameConfig;
  this._pineconeIndex = gameConfig.initialPineconeIndex;
  this._treePositions = gameConfig.treePositions;
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
  numberOfCells() { return this._height * this._width; },
  isBearAttacking() {
    return this._bearGridPosition.getCurrentCellIndex()
      === this._lumberjackGridPosition.getCurrentCellIndex();
  },
  bearGridPosition() { return this._bearGridPosition; },
  lumberjackGridPosition() { return this._lumberjackGridPosition; },
  lumberjack() { return this._lumberjack; },
  bear() { return this._bear; },
  pineconeIndex() { return this._pineconeIndex; },
  lastPineconeIndex() { return this._lastPineconeIndex; },
  moveBear(direction) {
    if (this.bearGridPosition().canMove(direction)) {
      this.bearGridPosition().move(direction);
      this.updateStatuses();
      return true;
    }
    return false;
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
    return this._lumberjackGridPosition.getCurrentCellIndex() === this.pineconeIndex();
  },
  generateRandomIndex() { return Math.floor(Math.random() * this.numberOfCells()); },
  spawnPinecone() {
    const bearIndex = this._bearGridPosition.getCurrentCellIndex();
    let pineconeIndex = this.generateRandomIndex();

    while (this._treePositions.includes(pineconeIndex) || pineconeIndex === bearIndex) {
      pineconeIndex = this.generateRandomIndex();
    }
    this._pineconeIndex = pineconeIndex;
  },
  removePinecone() {
    this._lastPineconeIndex = this._pineconeIndex;
    this._pineconeIndex = null;
  },
};
