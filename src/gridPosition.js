export default function GridPosition(
  startingXCoordinate,
  startingYCoordinate,
  gridWidth,
  gridHeight,
  treePositions,
) {
  this._currentXCoordinate = startingXCoordinate;
  this._currentYCoordinate = startingYCoordinate;
  this._previousXCoordinate = startingXCoordinate;
  this._previousYCoordinate = startingYCoordinate;
  this._gridWidth = gridWidth;
  this._gridHeight = gridHeight;
  this._treePositions = treePositions;
}

GridPosition.prototype = {
  canMove(direction) {
    const nextXCoordinate = this.getNextXCoordinate(direction);
    const nextYCoordinate = this.getNextYCoordinate(direction);
    const nextCellIndex = nextXCoordinate + nextYCoordinate * 10;

    return nextXCoordinate >= 0
      && nextXCoordinate < this._gridWidth
      && nextYCoordinate >= 0
      && nextYCoordinate < this._gridHeight
      && !this._treePositions.includes(nextCellIndex);
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
    return this._previousXCoordinate + this._previousYCoordinate * 10;
  },
  calculateIdealRoute(xCoordinate, yCoordinate) {
    let routeXCoordinate = this._currentXCoordinate;
    let routeYCoordinate = this._currentYCoordinate;
    const route = [];

    const updateYCoordinate = () => {
      if (yCoordinate < routeYCoordinate) {
        routeYCoordinate -= 1;
      } else routeYCoordinate += 1;
    };

    const updateXCoordinate = () => {
      if (xCoordinate < routeXCoordinate) {
        routeXCoordinate -= 1;
      } else routeXCoordinate += 1;
    };

    while (routeXCoordinate !== xCoordinate || routeYCoordinate !== yCoordinate) {
      if (Math.abs(routeXCoordinate - xCoordinate) > Math.abs(routeYCoordinate - yCoordinate)) {
        updateXCoordinate();
      } else updateYCoordinate();

      route.push([routeXCoordinate, routeYCoordinate]);
    }
    return route;
  },
};
