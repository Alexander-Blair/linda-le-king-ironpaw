import RouteFinder from '../../src/routeFinder';

describe('RouteFinder', () => {
  let routeFinder;

  describe('calculateIdealRoute', () => {
    const gridWidth = 5;
    const gridHeight = 5;
    const treePositions = [];

    let currentXCoordinate;
    let currentYCoordinate;
    let targetXCoordinate;
    let targetYCoordinate;
    let route;

    describe('when directly above the other grid position', () => {
      beforeEach(() => {
        targetXCoordinate = 2;
        targetYCoordinate = 4;
        currentXCoordinate = 2;
        currentYCoordinate = 0;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | |S| | |
      // | | |↓| | |
      // | | |↓| | |
      // | | |↓| | |
      // | | |T| | |

      it('heads to the target', () => {
        route = routeFinder.calculateIdealRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]]),
        );
      });
    });

    describe('when directly below the other grid position', () => {
      beforeEach(() => {
        currentXCoordinate = 1;
        currentYCoordinate = 4;
        targetXCoordinate = 1;
        targetYCoordinate = 0;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | |T| | | |
      // | |↑| | | |
      // | |↑| | | |
      // | |↑| | | |
      // | |S| | | |

      it('heads to the target', () => {
        route = routeFinder.calculateIdealRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[1, 4], [1, 3], [1, 2], [1, 1], [1, 0]]),
        );
      });
    });

    describe('when directly to the left of the other grid position', () => {
      beforeEach(() => {
        currentXCoordinate = 0;
        currentYCoordinate = 4;
        targetXCoordinate = 4;
        targetYCoordinate = 4;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // |S|→|→|→|T|

      it('heads to the target', () => {
        route = routeFinder.calculateIdealRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]]),
        );
      });
    });

    describe('when directly to the right of the other grid position', () => {
      beforeEach(() => {
        currentXCoordinate = 4;
        currentYCoordinate = 3;
        targetXCoordinate = 0;
        targetYCoordinate = 3;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // |T|←|←|←|S|
      // | | | | | |

      it('heads to the target', () => {
        route = routeFinder.calculateIdealRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[4, 3], [3, 3], [2, 3], [1, 3], [0, 3]]),
        );
      });
    });

    describe('when in bottom left corner, and target is top right', () => {
      beforeEach(() => {
        currentXCoordinate = 0;
        currentYCoordinate = 4;
        targetXCoordinate = 4;
        targetYCoordinate = 0;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // Note that when the x and y distance are equal, the initial movement will be
      // made on the y axis
      //
      // | | | |↑|T|
      // | | |↑|→| |
      // | |↑|→| | |
      // |↑|→| | | |
      // |S| | | | |

      it('heads to the target', () => {
        route = routeFinder.calculateIdealRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[0, 4], [0, 3], [1, 3], [1, 2], [2, 2], [2, 1], [3, 1], [3, 0], [4, 0]]),
        );
      });
    });

    describe('when in bottom right corner, and target is top left', () => {
      beforeEach(() => {
        currentXCoordinate = 4;
        currentYCoordinate = 4;
        targetXCoordinate = 0;
        targetYCoordinate = 0;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // |T|↑| | | |
      // | |←|↑| | |
      // | | |←|↑| |
      // | | | |←|↑|
      // | | | | |S|

      it('heads to the target', () => {
        route = routeFinder.calculateIdealRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[4, 4], [4, 3], [3, 3], [3, 2], [2, 2], [2, 1], [1, 1], [1, 0], [0, 0]]),
        );
      });
    });

    describe('when in top right corner, and target is bottom left', () => {
      beforeEach(() => {
        currentXCoordinate = 4;
        currentYCoordinate = 0;
        targetXCoordinate = 0;
        targetYCoordinate = 4;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // | | | | |S|
      // | | | |←|↓|
      // | | |←|↓| |
      // | |←|↓| | |
      // |T|↓| | | |

      it('heads to the target', () => {
        route = routeFinder.calculateIdealRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[4, 0], [4, 1], [3, 1], [3, 2], [2, 2], [2, 3], [1, 3], [1, 4], [0, 4]]),
        );
      });
    });

    describe('when in top left corner, and target is bottom right', () => {
      beforeEach(() => {
        currentXCoordinate = 0;
        currentYCoordinate = 0;
        targetXCoordinate = 4;
        targetYCoordinate = 4;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // |S| | | | |
      // |↓|→| | | |
      // | |↓|→| | |
      // | | |↓|→| |
      // | | | |↓|T|

      it('heads to the target', () => {
        route = routeFinder.calculateIdealRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4], [4, 4]]),
        );
      });
    });
  });

  describe('calculateRoute', () => {
    let currentXCoordinate;
    let currentYCoordinate;
    let targetXCoordinate;
    let targetYCoordinate;
    let route;

    describe('when directly below the other grid position, but blocked by trees', () => {
      const treePositions = [[0, 2], [1, 2]];
      const gridWidth = 5;
      const gridHeight = 5;

      beforeEach(() => {
        currentXCoordinate = 1;
        currentYCoordinate = 4;
        targetXCoordinate = 1;
        targetYCoordinate = 0;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | |T| | | |
      // | |←|↑| | |
      // |*|*|↑| | |
      // | |↑|→| | |
      // | |S| | | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[1, 4], [1, 3], [2, 3], [2, 2], [2, 1], [1, 1], [1, 0]]),
        );
      });
    });

    describe('when far away and blocked by multiple trees', () => {
      const treePositions = [
        [0, 2], [1, 2], [1, 6], [1, 7], [1, 8], [2, 2], [4, 3], [4, 4], [4, 5],
        [7, 0], [7, 6], [7, 7], [7, 8], [8, 0], [8, 3], [8, 4], [9, 0],
      ];
      const gridWidth = 10;
      const gridHeight = 10;

      beforeEach(() => {
        currentXCoordinate = 9;
        currentYCoordinate = 9;
        targetXCoordinate = 0;
        targetYCoordinate = 0;

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentXCoordinate,
          currentYCoordinate,
          targetXCoordinate,
          targetYCoordinate,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // |T| | | | | | |*|*|*|
      // | | | | | | | | | | |
      // |*|*|*| | | | | | | |
      // | | | | |*| | | |*| |
      // | | | | |*| | | |*| |
      // | | | | |*| | | | | |
      // | |*| | | | | |*| | |
      // | |*| | | | | |*| | |
      // | |*| | | | | |*| | |
      // | | | | | | | | | |S|

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([
            [9, 9], [9, 8], [8, 8], [8, 7], [8, 6], [8, 5], [7, 5],
            [6, 5], [5, 5], [5, 4], [5, 3], [5, 2], [4, 2], [3, 2],
            [3, 1], [2, 1], [1, 1], [1, 0], [0, 0],
          ]),
        );
      });
    });
  });
});
