(function(exports) {
  const treePositions = [7, 8, 9, 20, 21, 22, 34, 38, 44, 48, 54, 61, 67, 71, 77, 81, 87];

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
    this._bear = new Bear();
    this._cells = initializeCells();
    this._lumberjackGridPosition = new GridPosition(0, 0, width, height, this._cells);
    this._bearGridPosition = new GridPosition(9, 9, width, height, this._cells);
  }

  Grid.prototype = {
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
      switch (direction) {
        case 'right':
          this.bearGridPosition().moveRight();
          break;
        case 'left':
          this.bearGridPosition().moveLeft();
          break;
        case 'down':
          this.bearGridPosition().moveDown();
          break;
        case 'up':
          this.bearGridPosition().moveUp();
          break;
        default:
      }
    },
    moveLumberjack(direction) {
      switch (direction) {
        case 'right':
          this.lumberjackGridPosition().moveRight();
          break;
        case 'left':
          this.lumberjackGridPosition().moveLeft();
          break;
        case 'down':
          this.lumberjackGridPosition().moveDown();
          break;
        case 'up':
          this.lumberjackGridPosition().moveUp();
          break;
        default:
      }
    },
  };

  exports.Grid = Grid;
})(this);
