import RouteFinder from '../../../src/game/routeFinder';

describe('RouteFinder', () => {
  let routeFinder;

  describe('calculateRoute', () => {
    let currentPosition;
    let targetPosition;
    let route;

    describe('when directly above the other grid position', () => {
      const gridWidth = 5;
      const gridHeight = 5;
      const treePositions = [];

      beforeEach(() => {
        targetPosition = [2, 4];
        currentPosition = [2, 0];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | |S| | |
      // | | |↓| | |
      // | | |↓| | |
      // | | |↓| | |
      // | | |T| | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]]),
        );
      });
    });

    describe('when directly below the other grid position', () => {
      const gridWidth = 5;
      const gridHeight = 5;
      const treePositions = [];

      beforeEach(() => {
        currentPosition = [1, 4];
        targetPosition = [1, 0];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | |T| | | |
      // | |↑| | | |
      // | |↑| | | |
      // | |↑| | | |
      // | |S| | | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[1, 4], [1, 3], [1, 2], [1, 1], [1, 0]]),
        );
      });
    });

    describe('when directly to the left of the other grid position', () => {
      const gridWidth = 5;
      const gridHeight = 5;
      const treePositions = [];

      beforeEach(() => {
        currentPosition = [0, 4];
        targetPosition = [4, 4];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // |S|→|→|→|T|

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]]),
        );
      });
    });

    describe('when directly to the right of the other grid position', () => {
      const gridWidth = 5;
      const gridHeight = 5;
      const treePositions = [];

      beforeEach(() => {
        currentPosition = [4, 3];
        targetPosition = [0, 3];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // |T|←|←|←|S|
      // | | | | | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[4, 3], [3, 3], [2, 3], [1, 3], [0, 3]]),
        );
      });
    });

    describe('when in bottom left corner, and target is top right', () => {
      const gridWidth = 5;
      const gridHeight = 5;
      const treePositions = [];

      beforeEach(() => {
        currentPosition = [0, 4];
        targetPosition = [4, 0];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // Note that when the x and y distance are equal, the initial movement will be
      // made on the y axis
      //
      // | | | |↑|T|
      // | | | |↑| |
      // | |↑|→|→| |
      // |↑|→| | | |
      // |S| | | | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[0, 4], [0, 3], [1, 3], [1, 2], [2, 2], [3, 2], [3, 1], [3, 0], [4, 0]]),
        );
      });
    });

    describe('when in bottom right corner, and target is top left', () => {
      const gridWidth = 5;
      const gridHeight = 5;
      const treePositions = [];

      beforeEach(() => {
        currentPosition = [4, 4];
        targetPosition = [0, 0];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // |T|↑| | | |
      // | |↑| | | |
      // | |←|←|↑| |
      // | | | |←|↑|
      // | | | | |S|

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[4, 4], [4, 3], [3, 3], [3, 2], [2, 2], [1, 2], [1, 1], [1, 0], [0, 0]]),
        );
      });
    });

    describe('when in top right corner, and target is bottom left', () => {
      const gridWidth = 5;
      const gridHeight = 5;
      const treePositions = [];

      beforeEach(() => {
        currentPosition = [4, 0];
        targetPosition = [0, 4];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // | | | | |S|
      // | | | |←|↓|
      // | |←|←|↓| |
      // | |↓| | | |
      // |T|↓| | | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[4, 0], [4, 1], [3, 1], [3, 2], [2, 2], [1, 2], [1, 3], [1, 4], [0, 4]]),
        );
      });
    });

    describe('when in top left corner, and target is bottom right', () => {
      const gridWidth = 5;
      const gridHeight = 5;
      const treePositions = [];

      beforeEach(() => {
        currentPosition = [0, 0];
        targetPosition = [4, 4];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // |S| | | | |
      // |↓|→| | | |
      // | |↓|→|→| |
      // | | | |↓| |
      // | | | |↓|T|

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [3, 2], [3, 3], [3, 4], [4, 4]]),
        );
      });
    });

    describe('when directly below the other grid position, but blocked by trees', () => {
      const treePositions = [[0, 2], [1, 2]];
      const gridWidth = 5;
      const gridHeight = 5;

      beforeEach(() => {
        currentPosition = [1, 4];
        targetPosition = [1, 0];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | |T|↑| | |
      // | | |↑| | |
      // |*|*|↑| | |
      // | | |↑| | |
      // | |S|→| | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[1, 4], [2, 4], [2, 3], [2, 2], [2, 1], [2, 0], [1, 0]]),
        );
      });
    });

    describe('when there is a pile of trees in the way', () => {
      const treePositions = [[0, 2], [1, 2], [2, 2]];
      const gridWidth = 5;
      const gridHeight = 5;

      beforeEach(() => {
        currentPosition = [3, 3];
        targetPosition = [0, 1];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | | | | |
      // |T|←|←|↑| |
      // |*|*|*|↑| |
      // | | | |S| |
      // | | | | | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[3, 3], [3, 2], [3, 1], [2, 1], [1, 1], [0, 1]]),
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
        currentPosition = [9, 9];
        targetPosition = [0, 0];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // |T|↑| | | | | |*|*|*|
      // | |←|←|←|↑| | | | | |
      // |*|*|*| |←|↑| | | | |
      // | | | | |*|↑| | |*| |
      // | | | | |*|←|↑| |*| |
      // | | | | |*| |↑| | | |
      // | |*| | | | |↑|*| | |
      // | |*| | | | |↑|*| | |
      // | |*| | | | |↑|*| | |
      // | | | | | | |←|←|←|S|

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([
            [9, 9], [8, 9], [7, 9], [6, 9], [6, 8], [6, 7], [6, 6],
            [6, 5], [6, 4], [5, 4], [5, 3], [5, 2], [4, 2], [4, 1],
            [3, 1], [2, 1], [1, 1], [1, 0], [0, 0],
          ]),
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
        currentPosition = [6, 5];
        targetPosition = [0, 1];

        routeFinder = new RouteFinder(
          gridWidth,
          gridHeight,
          treePositions,
          currentPosition,
          targetPosition,
        );
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | | | | | | |*|*|*|
      // |T|←|←|↑| | | | | | |
      // |*|*|*|←|←|←|↑| | | |
      // | | | | |*| |↑| |*| |
      // | | | | |*| |↑| |*| |
      // | | | | |*| |S| | | |
      // | |*| | | | | |*| | |
      // | |*| | | | | |*| | |
      // | |*| | | | | |*| | |
      // | | | | | | | | | | |

      it('heads to the target', () => {
        route = routeFinder.calculateRoute();

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([
            [6, 5], [6, 4], [6, 3], [6, 2], [5, 2], [4, 2], [3, 2],
            [3, 1], [2, 1], [1, 1], [0, 1],
          ]),
        );
      });
    });
  });
});
