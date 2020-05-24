import containsTree from './utils/containsTree';

export default function RouteFinder(
  gridWidth,
  gridHeight,
  treePositions,
  currentPosition,
  targetPosition,
) {
  this._gridWidth = gridWidth;
  this._gridHeight = gridHeight;
  this._treePositions = treePositions;
  this._startPosition = currentPosition;
  this._targetPosition = targetPosition;
}

const MAXIMUM_CONCURRENT_BRANCES = 16;

RouteFinder.prototype = {
  generateAllPossibleSteps(currentPosition) {
    const possibilities = [];

    if (currentPosition[1] + 1 < this._gridHeight) {
      possibilities.push([currentPosition[0], currentPosition[1] + 1]);
    }
    if (currentPosition[1] > 0) {
      possibilities.push([currentPosition[0], currentPosition[1] - 1]);
    }
    if (currentPosition[0] + 1 < this._gridWidth) {
      possibilities.push([currentPosition[0] + 1, currentPosition[1]]);
    }
    if (currentPosition[0] > 0) possibilities.push([currentPosition[0] - 1, currentPosition[1]]);

    return possibilities;
  },
  removeRepeatsOrTreeOccupiedSquares(possibilities, route) {
    return possibilities.filter((position) => (
      !containsTree(this._treePositions, position) && !route.some((routePosition) => (
        routePosition[0] === position[0] && routePosition[1] === position[1]
      ))
    ));
  },
  generateNextPossibleSteps(currentPosition, route) {
    let possibilities = this.generateAllPossibleSteps(currentPosition);
    possibilities = this.removeRepeatsOrTreeOccupiedSquares(possibilities, route);
    return possibilities;
  },
  generateNextAttempts(route) {
    const currentPosition = route[route.length - 1];
    const nextPossibleSteps = this.generateNextPossibleSteps(currentPosition, route);
    return nextPossibleSteps
      .map((nextPosition) => {
        const branch = this.clone(route);
        branch.push(nextPosition);
        return branch;
      });
  },
  distanceFromTarget(currentPosition) {
    return Math.abs(currentPosition[0] - this._targetPosition[0])
      + Math.abs(currentPosition[1] - this._targetPosition[1]);
  },
  selectMostPromisingRoutes(routeAttempts) {
    return routeAttempts.sort((first, second) => {
      const firstDistance = this.distanceFromTarget(first[first.length - 1]);
      const secondDistance = this.distanceFromTarget(second[second.length - 1]);
      return firstDistance >= secondDistance ? 1 : -1;
    }).slice(0, MAXIMUM_CONCURRENT_BRANCES - 1);
  },
  reachedTarget(routeAttempt) {
    const currentPosition = routeAttempt[routeAttempt.length - 1];
    return this._targetPosition[0] === currentPosition[0]
      && this._targetPosition[1] === currentPosition[1];
  },
  clone(array) { return JSON.parse(JSON.stringify(array)); },
  orderAttempts(routeAttempts) {
    return routeAttempts.sort((first, second) => {
      const firstCurrentPosition = first[first.length - 1];
      const secondCurrentPosition = second[first.length - 1];
      const firstLargestDistance = Math.max(
        Math.abs(firstCurrentPosition[0] - this._targetPosition[0]),
        Math.abs(firstCurrentPosition[1] - this._targetPosition[1]),
      );
      const secondLargestDistance = Math.max(
        Math.abs(secondCurrentPosition[0] - this._targetPosition[0]),
        Math.abs(secondCurrentPosition[1] - this._targetPosition[1]),
      );

      return firstLargestDistance > secondLargestDistance ? 1 : -1;
    });
  },
  calculateRoute() {
    const initialRoute = [this._startPosition];
    let routeAttempts = this.generateNextAttempts(initialRoute);
    while (
      !routeAttempts || !routeAttempts.some((routeAttempt) => this.reachedTarget(routeAttempt))
    ) {
      routeAttempts = routeAttempts
        .map((routeAttempt) => this.generateNextAttempts(routeAttempt)).flat();

      routeAttempts = this.selectMostPromisingRoutes(routeAttempts, this._targetIndex);
      routeAttempts = this.orderAttempts(routeAttempts, this._targetIndex);
    }

    return routeAttempts
      .filter((routeAttempt) => this.reachedTarget(routeAttempt))[0];
  },
};
