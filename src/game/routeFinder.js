import containsTree from './utils/containsTree';

export default function RouteFinder(
  gridWidth,
  gridHeight,
  treePositions,
  currentXCoordinate,
  currentYCoordinate,
  targetXCoordinate,
  targetYCoordinate,
) {
  this._gridWidth = gridWidth;
  this._gridHeight = gridHeight;
  this._treePositions = treePositions;
  this._currentXCoordinate = currentXCoordinate;
  this._currentYCoordinate = currentYCoordinate;
  this._targetXCoordinate = targetXCoordinate;
  this._targetYCoordinate = targetYCoordinate;
}

RouteFinder.prototype = {
  isOutOfBounds(xCoordinate, yCoordinate) {
    return xCoordinate < 0 || yCoordinate < 0
      || xCoordinate >= this._gridWidth || yCoordinate >= this._gridHeight;
  },
  routeContains(xCoordinate, yCoordinate, route) {
    return route.some((routePosition) => (
      routePosition[0] === xCoordinate && routePosition[1] === yCoordinate
    ));
  },
  generateNextPossibleSquares(xCoordinate, yCoordinate, route) {
    const possibilities = [
      [xCoordinate, yCoordinate + 1], [xCoordinate, yCoordinate - 1],
      [xCoordinate + 1, yCoordinate], [xCoordinate - 1, yCoordinate],
    ];
    return possibilities.filter((position) => (
      !containsTree(this._treePositions, position)
        && !this.isOutOfBounds(position[0], position[1])
        && !this.routeContains(position[0], position[1], route)
    ));
  },
  clone(array) {
    return JSON.parse(JSON.stringify(array));
  },
  generateNextSteps(route) {
    const currentPosition = route[route.length - 1];
    const nextPossibleSquares = this.generateNextPossibleSquares(
      currentPosition[0], currentPosition[1], route,
    );
    return nextPossibleSquares
      .map((nextPosition) => {
        const branch = this.clone(route);
        branch.push(nextPosition);
        return branch;
      });
  },
  generateRouteByForce(route, firstTargetIndex, idealRoute) {
    let routeAttempts = this.generateNextSteps(route);
    while (!routeAttempts.some((routeAttempt) => (
      this.reachedTarget(routeAttempt, firstTargetIndex, idealRoute)
    ))) {
      routeAttempts = routeAttempts.map((routeAttempt) => (
        this.generateNextSteps(routeAttempt)
      )).flat();
    }
    return routeAttempts.filter((routeAttempt) => (
      this.reachedTarget(routeAttempt, firstTargetIndex, idealRoute)
    ))[0];
  },
  reachedTarget(routeAttempt, firstTargetIndex, idealRoute) {
    const lastRoutePosition = routeAttempt[routeAttempt.length - 1];
    const targets = idealRoute.filter((_, index) => index >= firstTargetIndex);

    return targets.some((target) => (
      lastRoutePosition[0] === target[0] && lastRoutePosition[1] === target[1]
    ));
  },
  calculateRoute() {
    const idealRoute = this.calculateIdealRoute();
    let route = [];
    let rerouting = false;

    idealRoute.forEach((idealRoutePosition, index) => {
      if (containsTree(this._treePositions, idealRoutePosition)) {
        if (rerouting) return;

        rerouting = true;
        let target;
        let firstTargetIndex;
        let potentialTargetIndex = index + 1;
        while (!target && potentialTargetIndex < idealRoute.length) {
          const potentialTarget = idealRoute[potentialTargetIndex];
          if (!containsTree(this._treePositions, potentialTarget)) {
            firstTargetIndex = potentialTargetIndex;
            target = potentialTarget;
          }
          potentialTargetIndex += 1;
        }

        route = this.generateRouteByForce(route, firstTargetIndex, idealRoute);
      } else {
        rerouting = false;
        const mostAdvancedPositionIndex = idealRoute.reduce((mostAdvancedIndex, position, i) => {
          if (this.routeContains(position[0], position[1], route)) return i;
          return mostAdvancedIndex;
        }, -1);
        if (index > mostAdvancedPositionIndex) route.push(idealRoutePosition);
      }
    });
    return route;
  },
  calculateIdealRoute() {
    let routeXCoordinate = this._currentXCoordinate;
    let routeYCoordinate = this._currentYCoordinate;
    const route = [[routeXCoordinate, routeYCoordinate]];

    const updateYCoordinate = () => {
      if (this._targetYCoordinate < routeYCoordinate) {
        routeYCoordinate -= 1;
      } else routeYCoordinate += 1;
    };

    const updateXCoordinate = () => {
      if (this._targetXCoordinate < routeXCoordinate) {
        routeXCoordinate -= 1;
      } else routeXCoordinate += 1;
    };

    while (routeXCoordinate !== this._targetXCoordinate
      || routeYCoordinate !== this._targetYCoordinate) {
      if (Math.abs(routeXCoordinate - this._targetXCoordinate)
        > Math.abs(routeYCoordinate - this._targetYCoordinate)) {
        updateXCoordinate();
      } else updateYCoordinate();

      route.push([routeXCoordinate, routeYCoordinate]);
    }
    return route;
  },
};
