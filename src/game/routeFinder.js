import containsTree from './utils/containsTree';

export default function RouteFinder(gridWidth, gridHeight, treePositions) {
  this._gridWidth = gridWidth;
  this._gridHeight = gridHeight;
  this._treePositions = treePositions;
}

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
  squareInRouteAlready(route, position) {
    return route.some((routePosition) => (
      routePosition[0] === position[0] && routePosition[1] === position[1]
    ));
  },
  generateNextAttempts(route) {
    return this.generateAllPossibleSteps(route[route.length - 1])
      .filter((position) => (
        !containsTree(this._treePositions, position)
        && !this.squareInRouteAlready(route, position)
      ))
      .map((nextPosition) => {
        const branch = route.map((position) => position.slice());
        branch.push(nextPosition);
        return branch;
      });
  },
  reachedTarget(routeAttempt, targetPosition) {
    const currentPosition = routeAttempt[routeAttempt.length - 1];
    return targetPosition[0] === currentPosition[0]
      && targetPosition[1] === currentPosition[1];
  },
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
  removeRoutesWithSameCurrentPosition(routeAttempts) {
    const endingPositions = [];

    return routeAttempts.filter((routeAttempt) => {
      const endingPosition = routeAttempt[routeAttempt.length - 1];
      const positionAlreadySeen = endingPositions.some((position) => (
        position[0] === endingPosition[0] && position[1] === endingPosition[1]
      ));
      if (!positionAlreadySeen) endingPositions.push(endingPosition);

      return !positionAlreadySeen;
    });
  },
  calculateRoute(startPosition, targetPosition) {
    let routeAttempts = this.generateNextAttempts([startPosition]);
    while (
      !routeAttempts.some((routeAttempt) => this.reachedTarget(routeAttempt, targetPosition))
    ) {
      routeAttempts = routeAttempts.map((routeAttempt) => (
        this.generateNextAttempts(routeAttempt)
      )).flat();

      routeAttempts = this.removeRoutesWithSameCurrentPosition(routeAttempts);
      routeAttempts = this.orderAttempts(routeAttempts, targetPosition);
    }

    return routeAttempts
      .filter((routeAttempt) => this.reachedTarget(routeAttempt, targetPosition))[0];
  },
};
