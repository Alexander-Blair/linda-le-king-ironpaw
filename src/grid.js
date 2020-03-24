(function(exports) {
  function Grid(height, width, lumberjackStartPosition, bearStartPosition) {
    this._height = height;
    this._width = width;
    this._lumberjackIndex = lumberjackStartPosition;
    this._bearIndex = bearStartPosition;
  }

  function initializeCells(height, width) {
    const treePositions = [7, 8, 9, 20, 21, 22, 34, 38, 44, 48, 54, 61, 67, 71, 77, 81, 87];
    const cells = [];
    for (let i = 0; i < height * width; i += 1) {
      if (treePositions.includes(i)) cells.push(new Cell('tree', false));
      else cells.push(new Cell('grass', true));
    }
    return cells;
  }

  Grid.prototype = {
    height() { return this._height; },
    width() { return this._width; },
    numberOfCells() { return this._height * this._width; },
    lumberjackIndex() { return this._lumberjackIndex; },
    bearIndex() { return this._bearIndex; },
    moveLumberjack(newIndex) { this._lumberjackIndex = newIndex; },
    moveBear(newIndex) { this._bearIndex = newIndex; },
    cells() {
      if (this._cells === undefined) return initializeCells(this._height, this._width);

      return this._cells;
    },
    getCell(cellIndex) { return this.cells()[cellIndex]; },
    isBearAttacking() { return this._lumberjackIndex === this._bearIndex; },
  };

  exports.Grid = Grid;
})(this);
