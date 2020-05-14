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
  this._currentPosition = currentPosition;
  this._targetPosition = targetPosition;
}

RouteFinder.prototype = {
  isOutOfBounds(xCoordinate, yCoordinate) {
    return xCoordinate < 0 || yCoordinate < 0
      || xCoordinate >= this._gridWidth || yCoordinate >= this._gridHeight;
  },
  generateNextPossibleSquares(xCoordinate, yCoordinate) {
    const possibilities = [
      [xCoordinate, yCoordinate + 1], [xCoordinate, yCoordinate - 1],
      [xCoordinate + 1, yCoordinate], [xCoordinate - 1, yCoordinate],
    ];
    return possibilities.filter((position) => (
      !containsTree(this._treePositions, position) && !this.isOutOfBounds(...position)
    ));
  },
  clone(array) { return JSON.parse(JSON.stringify(array)); },
  generateNextSteps(route) {
    const currentPosition = route[route.length - 1];
    const nextPossibleSquares = this.generateNextPossibleSquares(...currentPosition);
    return nextPossibleSquares
      .map((nextPosition) => {
        const branch = this.clone(route);
        branch.push(nextPosition);
        return branch;
      });
  },
  generateRouteByForce(route, target) {
    let routeAttempts = this.generateNextSteps(route);
    while (!routeAttempts.some((routeAttempt) => this.nextToTarget(routeAttempt, target))) {
      routeAttempts = routeAttempts.map((routeAttempt) => (
        this.generateNextSteps(routeAttempt)
      )).flat();
    }

    return routeAttempts.filter((routeAttempt) => this.nextToTarget(routeAttempt, target))[0];
  },
  nextToTarget(routeAttempt, target) {
    const lastRoutePosition = routeAttempt[routeAttempt.length - 1];
    return this.areAdjacent(lastRoutePosition, target);
  },
  areAdjacent(firstPosition, secondPosition) {
    if (!secondPosition) return true;

    return Math.abs(firstPosition[0] - secondPosition[0])
      + Math.abs(firstPosition[1] - secondPosition[1]) === 1;
  },
  linkGapsInIdealRoute(idealRoute) {
    return idealRoute.reduce((route, currentRoutePosition, index) => {
      const nextRoutePosition = idealRoute[index + 1];

      route.push(currentRoutePosition);

      if (!this.areAdjacent(currentRoutePosition, nextRoutePosition)) {
        return this.generateRouteByForce(route, nextRoutePosition);
      }

      return route;
    }, []);
  },
  removeUnavailableSquares(route) {
    return route.filter((position) => (
      !containsTree(this._treePositions, position)
        && !this.isOutOfBounds(position[0], position[1])
    ));
  },
  squareOccurrences(route) {
    const occurrences = {};

    route.forEach((position) => {
      const positionAsString = JSON.stringify(position);
      const count = occurrences[positionAsString] || 0;
      occurrences[positionAsString] = count + 1;
    });
    return occurrences;
  },
  removeRepeatedSquares(route) {
    let skipping;
    const occurrences = this.squareOccurrences(route);

    return route.reduce((finalRoute, position) => {
      if (occurrences[JSON.stringify(position)] > 1 && skipping) {
        finalRoute.push(position);
        skipping = false;
      } else if (occurrences[JSON.stringify(position)] > 1 && !skipping) {
        skipping = true;
      } else if (!skipping) finalRoute.push(position);
      return finalRoute;
    }, []);
  },
  calculateRoute() {
    const idealRoute = this.calculateIdealRoute();
    const idealRouteWithUnavailableSquaresRemoved = this.removeUnavailableSquares(idealRoute);
    const route = this.linkGapsInIdealRoute(idealRouteWithUnavailableSquaresRemoved);
    return this.removeRepeatedSquares(route);
  },
  calculateIdealRoute() {
    let [routeXCoordinate, routeYCoordinate] = this._currentPosition;
    const [targetXCoordinate, targetYCoordinate] = this._targetPosition;

    const route = [[routeXCoordinate, routeYCoordinate]];

    const updateYCoordinate = () => {
      if (targetYCoordinate < routeYCoordinate) {
        routeYCoordinate -= 1;
      } else routeYCoordinate += 1;
    };

    const updateXCoordinate = () => {
      if (targetXCoordinate < routeXCoordinate) {
        routeXCoordinate -= 1;
      } else routeXCoordinate += 1;
    };

    while (routeXCoordinate !== targetXCoordinate
      || routeYCoordinate !== targetYCoordinate) {
      if (Math.abs(routeXCoordinate - targetXCoordinate)
        > Math.abs(routeYCoordinate - targetYCoordinate)) {
        updateXCoordinate();
      } else updateYCoordinate();

      route.push([routeXCoordinate, routeYCoordinate]);
    }
    return route;
  },
};
