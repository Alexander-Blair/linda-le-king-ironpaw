import RouteFinder from './routeFinder';
import containsTree from './utils/containsTree';

export default function GridPosition(
  startingPosition, gridWidth, gridHeight, treePositions,
) {
  this._startingPosition = startingPosition;
  this._currentPosition = startingPosition;
  this._gridWidth = gridWidth;
  this._gridHeight = gridHeight;
  this._treePositions = treePositions;
}

GridPosition.prototype = {
  reset() { this._currentPosition = this._startingPosition; },
  canMove(direction) {
    const [nextXCoordinate, nextYCoordinate] = this.getNextPosition(direction);

    return nextXCoordinate >= 0
      && nextXCoordinate < this._gridWidth
      && nextYCoordinate >= 0
      && nextYCoordinate < this._gridHeight
      && !containsTree(this._treePositions, [nextXCoordinate, nextYCoordinate]);
  },
  moveTo(xCoordinate, yCoordinate) { this._currentPosition = [xCoordinate, yCoordinate]; },
  move(direction) { this._currentPosition = this.getNextPosition(direction); },
  getNextPosition(direction) {
    const xCoordinate = this._currentPosition[0] + ({ right: 1, left: -1 }[direction] || 0);
    const yCoordinate = this._currentPosition[1] + ({ down: 1, up: -1 }[direction] || 0);
    return [xCoordinate, yCoordinate];
  },
  getCurrentPosition() { return this._currentPosition; },
  getRoute(targetPosition) {
    return new RouteFinder(
      this._gridWidth,
      this._gridHeight,
      this._treePositions,
      this._currentPosition,
      targetPosition,
    ).calculateRoute();
  },
  nextPosition(targetPosition) {
    let route;

    if (this._currentTargetPosition && this._currentRoute
      && this._currentTargetPosition[0] === targetPosition[0]
      && this._currentTargetPosition[1] === targetPosition[1]) {
      route = this._currentRoute;
    } else {
      route = this.getRoute(targetPosition);
    }
    this._currentRoute = route;
    this._currentTargetPosition = targetPosition;

    const nextPosition = route.filter((_, index) => {
      const previousPositionIndex = index - 1;
      if (previousPositionIndex === -1) return false;
      return route[previousPositionIndex][0] === this._currentPosition[0]
        && route[previousPositionIndex][1] === this._currentPosition[1];
    });
    if (nextPosition.length > 0) return nextPosition[0];

    return route[1];
  },
};
