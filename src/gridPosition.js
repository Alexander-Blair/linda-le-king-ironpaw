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
    const route = [[routeXCoordinate, routeYCoordinate]];

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
  getIndex(xCoordinate, yCoordinate) {
    return xCoordinate + yCoordinate * 10;
  },
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
    return possibilities.filter((position) => {
      const indexOnBoard = this.getIndex(position[0], position[1]);
      return !this._treePositions.includes(indexOnBoard)
        && !this.isOutOfBounds(position[0], position[1])
        && !this.routeContains(position[0], position[1], route);
    });
  },
  clone(array) {
    return JSON.parse(JSON.stringify(array));
  },
  distanceFrom(currentX, currentY, targetX, targetY) {
    return Math.abs(currentX - targetX) + Math.abs(currentY - targetY);
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
  nextPosition(targetXCoordinate, targetYCoordinate) {
    let route;

    if (this._currentTargetXCoordinate === targetXCoordinate
      && this._currentTargetYCoordinate === targetYCoordinate
      && this._currentRoute) {
      route = this._currentRoute;
    } else {
      route = this.calculateRoute(targetXCoordinate, targetYCoordinate);
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
  calculateRoute(xCoordinate, yCoordinate) {
    const reachedTarget = (routeAttempt, firstTargetIndex, idealRoute) => {
      const lastRoutePosition = routeAttempt[routeAttempt.length - 1];
      const targets = idealRoute.filter((_, index) => index >= firstTargetIndex);

      return targets.some((target) => (
        lastRoutePosition[0] === target[0] && lastRoutePosition[1] === target[1]
      ));
    };

    const idealRoute = this.calculateIdealRoute(xCoordinate, yCoordinate);
    let route = [];
    let rerouting = false;

    idealRoute.forEach((position, index) => {
      const indexOnBoard = this.getIndex(position[0], position[1]);

      if (this._treePositions.includes(indexOnBoard)) {
        if (rerouting) return;

        rerouting = true;
        let target;
        let firstTargetIndex;
        let potentialTargetIndex = index + 1;
        while (!target && potentialTargetIndex < idealRoute.length) {
          const potentialTarget = idealRoute[potentialTargetIndex];
          const indexOfPotentialTarget = this.getIndex(potentialTarget[0], potentialTarget[1]);
          if (!this._treePositions.includes(indexOfPotentialTarget)) {
            firstTargetIndex = potentialTargetIndex;
            target = potentialTarget;
          }
          potentialTargetIndex += 1;
        }

        let routeAttempts = this.generateNextSteps(route);
        while (!routeAttempts.some((routeAttempt) => (
          reachedTarget(routeAttempt, firstTargetIndex, idealRoute)
        ))) {
          routeAttempts = routeAttempts.map((routeAttempt) => (
            this.generateNextSteps(routeAttempt)
          )).flat();
        }
        const successfulAttempt = routeAttempts.filter((routeAttempt) => (
          reachedTarget(routeAttempt, firstTargetIndex, idealRoute)
        ))[0];

        route = successfulAttempt;
      } else {
        rerouting = false;
        const mostAdvancedPositionIndex = idealRoute.reduce((mostAdvancedIndex, p, i) => {
          if (this.routeContains(p[0], p[1], route)) return i;
          return mostAdvancedIndex;
        }, -1);
        if (index <= mostAdvancedPositionIndex) return;
        route = route.concat([position]);
      }
    });
    return route;
  },
};
