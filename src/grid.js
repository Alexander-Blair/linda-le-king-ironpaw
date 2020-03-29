(function(exports) {
  const treePositions = [7, 8, 9, 20, 21, 22, 34, 38, 44, 48, 54, 61, 67, 71, 77, 81, 87];
  const bearStartSpeed = 1000;
  const bearStartingXCoordinate = 9;
  const bearStartingYCoordinate = 9;
  const lumberjackStartingXCoordinate = 0;
  const lumberjackStartingYCoordinate = 0;

  function Grid(height, width, numberOfLives) {
    function initializeCells() {
      const cells = [];
      for (let i = 0; i < height * width; i += 1) {
        if (treePositions.includes(i)) cells.push(new Cell('tree', false));
        else cells.push(new Cell('grass', true));
      }
      return cells;
    }

    this._height = height;
    this._width = width;
    this._lumberjack = new Lumberjack(numberOfLives);
    this._bear = new Bear(bearStartSpeed);
    this._cells = initializeCells();
    this._lumberjackGridPosition = new GridPosition(
      lumberjackStartingXCoordinate,
      lumberjackStartingYCoordinate,
      width,
      height,
      this._cells,
    );
    this._bearGridPosition = new GridPosition(
      bearStartingXCoordinate,
      bearStartingYCoordinate,
      width,
      height,
      this._cells,
    );
    this._score = 0;
  }

  Grid.prototype = {
    score() { return this._score; },
    numberOfCells() { return this._height * this._width; },
    cells() { return this._cells; },
    getCell(cellIndex) { return this.cells()[cellIndex]; },
    isBearAttacking() {
      return this._bearGridPosition.getCurrentCellIndex()
        === this._lumberjackGridPosition.getCurrentCellIndex();
    },
    bearGridPosition() { return this._bearGridPosition; },
    lumberjackGridPosition() { return this._lumberjackGridPosition; },
    lumberjack() { return this._lumberjack; },
    bear() { return this._bear; },
    moveBear(direction) {
      if (this.bearGridPosition().canMove(direction)) {
        this.bearGridPosition().move(direction);
        return true;
      }
      return false;
    },
    moveLumberjack(direction) {
      this._lumberjack.setExploring();
      if (this.lumberjackGridPosition().canMove(direction)) {
        this.lumberjackGridPosition().move(direction);
      }
    },
    updateStatuses() {
      if (this.isBearAttacking()) {
        this._lumberjack.setHurt();
        this._bear.setAttacking();
        this._lumberjack.loseLife();
        this._lumberjack.setExploring();
      }
    },
  };

  exports.Grid = Grid;
})(this);
