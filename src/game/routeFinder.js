import containsTree from './utils/containsTree';

export default function RouteFinder(gridWidth, gridHeight, treePositions) {
  this._gridWidth = gridWidth;
  this._gridHeight = gridHeight;
  this._treePositions = treePositions;
}

const MAXIMUM_CONCURRENT_BRANCES = 64;

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
  distanceFrom(currentPosition, targetPosition) {
    return Math.abs(currentPosition[0] - targetPosition[0])
      + Math.abs(currentPosition[1] - targetPosition[1]);
  },
  selectMostPromisingRoutes(routeAttempts, targetPosition) {
    return routeAttempts.sort((first, second) => {
      const firstDistance = this.distanceFrom(first[first.length - 1], targetPosition);
      const secondDistance = this.distanceFrom(second[second.length - 1], targetPosition);
      return firstDistance >= secondDistance ? 1 : -1;
    }).slice(0, MAXIMUM_CONCURRENT_BRANCES - 1);
  },
  reachedTarget(routeAttempt, targetPosition) {
    const currentPosition = routeAttempt[routeAttempt.length - 1];
    return targetPosition[0] === currentPosition[0]
      && targetPosition[1] === currentPosition[1];
  },
  clone(array) { return JSON.parse(JSON.stringify(array)); },
  orderAttempts(routeAttempts, targetPosition) {
    return routeAttempts.sort((first, second) => {
      const firstCurrentPosition = first[first.length - 1];
      const secondCurrentPosition = second[first.length - 1];
      const firstLargestDistance = Math.max(
        Math.abs(firstCurrentPosition[0] - targetPosition[0]),
        Math.abs(firstCurrentPosition[1] - targetPosition[1]),
      );
      const secondLargestDistance = Math.max(
        Math.abs(secondCurrentPosition[0] - targetPosition[0]),
        Math.abs(secondCurrentPosition[1] - targetPosition[1]),
      );

      return firstLargestDistance > secondLargestDistance ? 1 : -1;
    });
  },
  calculateRoute(startPosition, targetPosition) {
    let routeAttempts = this.generateNextAttempts([startPosition]);
    while (
      !routeAttempts
      || !routeAttempts.some((routeAttempt) => this.reachedTarget(routeAttempt, targetPosition))
    ) {
      routeAttempts = routeAttempts
        .map((routeAttempt) => this.generateNextAttempts(routeAttempt)).flat();

      routeAttempts = this.selectMostPromisingRoutes(routeAttempts, targetPosition);
      routeAttempts = this.orderAttempts(routeAttempts, targetPosition);
    }

    return routeAttempts
      .filter((routeAttempt) => this.reachedTarget(routeAttempt, targetPosition))[0];
  },
};
