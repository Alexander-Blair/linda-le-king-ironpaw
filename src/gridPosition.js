(function(exports) {
  function GridPosition(xCoordinate, yCoordinate, gridWidth, gridHeight, cells) {
    this._xCoordinate = xCoordinate;
    this._yCoordinate = yCoordinate;
    this._gridWidth = gridWidth;
    this._gridHeight = gridHeight;
    this._cells = cells;
  }

  GridPosition.prototype = {
    moveLeft() {
      const nextXCoord = this._xCoordinate - 1;
      const nextCell = this.getCell(nextXCoord, this._yCoordinate);

      if (nextXCoord >= 0 && nextCell.isHabitable()) this._xCoordinate -= 1;
    },
    moveRight() {
      const nextXCoord = this._xCoordinate + 1;
      const nextCell = this.getCell(nextXCoord, this._yCoordinate);

      if (nextXCoord < this._gridWidth && nextCell.isHabitable()) this._xCoordinate += 1;
    },
    moveUp() {
      const nextYCoord = this._yCoordinate - 1;
      const nextCell = this.getCell(this._xCoordinate, nextYCoord);

      if (nextYCoord >= 0 && nextCell.isHabitable()) this._yCoordinate -= 1;
    },
    moveDown() {
      const nextYCoord = this._yCoordinate + 1;
      const nextCell = this.getCell(this._xCoordinate, nextYCoord);

      if (nextYCoord < this._gridHeight && nextCell.isHabitable()) this._yCoordinate += 1;
    },
    xCoordinate() { return this._xCoordinate; },
    yCoordinate() { return this._yCoordinate; },
    getCurrentCellIndex() { return this._xCoordinate + this._yCoordinate * 10; },
    getCell(xCoord, yCoord) { return this._cells[xCoord + yCoord * 10]; },
  };

  exports.GridPosition = GridPosition;
})(this);
