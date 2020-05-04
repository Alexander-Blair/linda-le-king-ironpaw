import RouteFinder from './routeFinder';
import containsTree from './utils/containsTree';

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
  gridWidth() { return this._gridWidth; },
  gridHeight() { return this._gridHeight; },
  treePositions() { return this._treePositions; },
  canMove(direction) {
    const nextXCoordinate = this.getNextXCoordinate(direction);
    const nextYCoordinate = this.getNextYCoordinate(direction);

    return nextXCoordinate >= 0
      && nextXCoordinate < this._gridWidth
      && nextYCoordinate >= 0
      && nextYCoordinate < this._gridHeight
      && !containsTree(this._treePositions, [nextXCoordinate, nextYCoordinate]);
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
  getCurrentPosition() {
    return [this._currentXCoordinate, this._currentYCoordinate];
  },
  getCurrentCellIndex() {
    return this._currentXCoordinate + this._currentYCoordinate * this._gridHeight;
  },
  getPreviousCellIndex() {
    return this._previousXCoordinate + this._previousYCoordinate * this._gridHeight;
  },
  getRoute(targetXCoordinate, targetYCoordinate) {
    return new RouteFinder(
      this._gridWidth,
      this._gridHeight,
      this._treePositions,
      this._currentXCoordinate,
      this._currentYCoordinate,
      targetXCoordinate,
      targetYCoordinate,
    ).calculateRoute();
  },
  nextPosition(targetPosition) {
    let route;
    const targetXCoordinate = targetPosition[0];
    const targetYCoordinate = targetPosition[1];

    if (this._currentTargetXCoordinate === targetXCoordinate
      && this._currentTargetYCoordinate === targetYCoordinate
      && this._currentRoute) {
      route = this._currentRoute;
    } else {
      route = this.getRoute(targetXCoordinate, targetYCoordinate);
    }
    this._currentRoute = route;
    this._currentTargetXCoordinate = targetXCoordinate;
    this._currentTargetYCoordinate = targetYCoordinate;

    const nextPosition = route.filter((_, index) => {
      const previousPositionIndex = index - 1;
      if (previousPositionIndex === -1) return false;
      return route[previousPositionIndex][0] === this._currentXCoordinate
        && route[previousPositionIndex][1] === this._currentYCoordinate;
    });
    if (nextPosition.length > 0) return nextPosition[0];

    return route[1];
  },
};
