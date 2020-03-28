(function(exports) {
  function GridPosition(startingXCoordinate, startingYCoordinate, gridWidth, gridHeight, cells) {
    this._currentXCoordinate = startingXCoordinate;
    this._currentYCoordinate = startingYCoordinate;
    this._previousXCoordinate = startingXCoordinate;
    this._previousYCoordinate = startingYCoordinate;
    this._gridWidth = gridWidth;
    this._gridHeight = gridHeight;
    this._cells = cells;
    this._currentDirection = 'right';
  }

  GridPosition.prototype = {
    canMove(direction) {
      const nextXCoordinate = this.getNextXCoordinate(direction);
      const nextYCoordinate = this.getNextYCoordinate(direction);
      const nextCell = this._cells[nextXCoordinate + nextYCoordinate * 10];

      return nextXCoordinate >= 0
        && nextXCoordinate < this._gridWidth
        && nextYCoordinate >= 0
        && nextYCoordinate < this._gridHeight
        && nextCell.isHabitable();
    },
    move(direction) {
      this._previousXCoordinate = this._currentXCoordinate;
      this._previousYCoordinate = this._currentYCoordinate;
      this._currentXCoordinate = this.getNextXCoordinate(direction);
      this._currentYCoordinate = this.getNextYCoordinate(direction);
    },
    getNextXCoordinate(direction) {
      return this._currentXCoordinate + ({ right: 1, left: -1 }[direction] || 0);
    },
    getNextYCoordinate(direction) {
      return this._currentYCoordinate + ({ down: 1, up: -1 }[direction] || 0);
    },
    getCurrentCellIndex() { return this._currentXCoordinate + this._currentYCoordinate * 10; },
    getPreviousCellIndex() {
      if (this._previousXCoordinate === undefined) return null;

      return this._previousXCoordinate + this._previousYCoordinate * 10;
    },
    getCurrentDirection() { return this._currentDirection; },
  };

  exports.GridPosition = GridPosition;
})(this);
