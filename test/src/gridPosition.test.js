import GridPosition from '../../src/gridPosition';

describe('GridPosition', () => {
  let gridPosition;

  describe('canMove', () => {
    const gridWidth = 10;
    const gridHeight = 10;
    let treePositions = [];

    describe('when on the far left of the board', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(
          0, 4, gridWidth, gridHeight, treePositions,
        );
      });

      it('cannot move left', () => {
        expect(gridPosition.canMove('left')).toBe(false);
      });

      it('can move right', () => {
        expect(gridPosition.canMove('right')).toBe(true);
      });
    });

    describe('when on the far right of the board', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(
          9, 4, gridWidth, gridHeight, treePositions,
        );
      });

      it('can move left', () => {
        expect(gridPosition.canMove('left')).toBe(true);
      });

      it('cannot move right', () => {
        expect(gridPosition.canMove('right')).toBe(false);
      });
    });

    describe('when at the top of the board', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(
          0, 0, gridWidth, gridHeight, treePositions,
        );
      });

      it('can move down', () => {
        expect(gridPosition.canMove('down')).toBe(true);
      });

      it('cannot move up', () => {
        expect(gridPosition.canMove('up')).toBe(false);
      });
    });

    describe('when at the bottom of the board', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(
          0, 9, gridWidth, gridHeight, treePositions,
        );
      });

      it('cannot move down', () => {
        expect(gridPosition.canMove('down')).toBe(false);
      });

      it('can move up', () => {
        expect(gridPosition.canMove('up')).toBe(true);
      });
    });

    describe('when there is a tree in the position requested', () => {
      treePositions = [15];

      describe('when approaching from left', () => {
        it('returns false', () => {
          gridPosition = new GridPosition(
            4, 1, gridWidth, gridHeight, treePositions,
          );

          expect(gridPosition.canMove('right')).toBe(false);
        });
      });

      describe('when approaching from right', () => {
        it('returns false', () => {
          gridPosition = new GridPosition(
            6, 1, gridWidth, gridHeight, treePositions,
          );

          expect(gridPosition.canMove('left')).toBe(false);
        });
      });

      describe('when approaching from top', () => {
        it('returns false', () => {
          gridPosition = new GridPosition(
            5, 0, gridWidth, gridHeight, treePositions,
          );

          expect(gridPosition.canMove('down')).toBe(false);
        });
      });

      describe('when approaching from bottom', () => {
        it('returns false', () => {
          gridPosition = new GridPosition(
            5, 2, gridWidth, gridHeight, treePositions,
          );

          expect(gridPosition.canMove('up')).toBe(false);
        });
      });
    });
  });

  describe('moving', () => {
    const gridWidth = 10;
    const gridHeight = 10;
    const treePositions = [];

    beforeEach(() => {
      gridPosition = new GridPosition(
        5, 2, gridWidth, gridHeight, treePositions,
      );
    });

    describe('when first initialized', () => {
      it('has the same current and previous index', () => {
        expect(gridPosition.getCurrentCellIndex()).toEqual(25);
        expect(gridPosition.getPreviousCellIndex()).toEqual(25);
      });

      it('keeps track of the previous indexes when moving', () => {
        gridPosition.move('left');

        expect(gridPosition.getPreviousCellIndex()).toEqual(25);
        expect(gridPosition.getCurrentCellIndex()).toEqual(24);

        gridPosition.move('down');

        expect(gridPosition.getPreviousCellIndex()).toEqual(24);
        expect(gridPosition.getCurrentCellIndex()).toEqual(34);

        gridPosition.move('right');

        expect(gridPosition.getPreviousCellIndex()).toEqual(34);
        expect(gridPosition.getCurrentCellIndex()).toEqual(35);
      });
    });
  });

  describe('calculateIdealRoute', () => {
    const gridWidth = 5;
    const gridHeight = 5;
    const treePositions = [];

    let xCoordinate;
    let yCoordinate;
    let route;

    describe('when directly above the other grid position', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(2, 0, gridWidth, gridHeight, treePositions);
        xCoordinate = 2;
        yCoordinate = 4;
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | |S| | |
      // | | |↓| | |
      // | | |↓| | |
      // | | |↓| | |
      // | | |T| | |

      it('heads to the target', () => {
        route = gridPosition.calculateIdealRoute(xCoordinate, yCoordinate);

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[2, 1], [2, 2], [2, 3], [2, 4]]),
        );
      });
    });

    describe('when directly below the other grid position', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(1, 4, gridWidth, gridHeight, treePositions);
        xCoordinate = 1;
        yCoordinate = 0;
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | |T| | | |
      // | |↑| | | |
      // | |↑| | | |
      // | |↑| | | |
      // | |S| | | |

      it('heads to the target', () => {
        route = gridPosition.calculateIdealRoute(xCoordinate, yCoordinate);

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[1, 3], [1, 2], [1, 1], [1, 0]]),
        );
      });
    });

    describe('when directly to the left of the other grid position', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(0, 4, gridWidth, gridHeight, treePositions);
        xCoordinate = 4;
        yCoordinate = 4;
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // |S|→|→|→|T|

      it('heads to the target', () => {
        route = gridPosition.calculateIdealRoute(xCoordinate, yCoordinate);

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[1, 4], [2, 4], [3, 4], [4, 4]]),
        );
      });
    });

    describe('when directly to the right of the other grid position', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(4, 3, gridWidth, gridHeight, treePositions);
        xCoordinate = 0;
        yCoordinate = 3;
      });

      // Diagram showing start position (S), target position (T), and expected route
      // | | | | | |
      // | | | | | |
      // | | | | | |
      // |T|←|←|←|S|
      // | | | | | |

      it('heads to the target', () => {
        route = gridPosition.calculateIdealRoute(xCoordinate, yCoordinate);

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[3, 3], [2, 3], [1, 3], [0, 3]]),
        );
      });
    });

    describe('when in bottom left corner, and target is top right', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(0, 4, gridWidth, gridHeight, treePositions);
        xCoordinate = 4;
        yCoordinate = 0;
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
        route = gridPosition.calculateIdealRoute(xCoordinate, yCoordinate);

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[0, 3], [1, 3], [1, 2], [2, 2], [2, 1], [3, 1], [3, 0], [4, 0]]),
        );
      });
    });

    describe('when in bottom right corner, and target is top left', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(4, 4, gridWidth, gridHeight, treePositions);
        xCoordinate = 0;
        yCoordinate = 0;
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // |T|↑| | | |
      // | |←|↑| | |
      // | | |←|↑| |
      // | | | |←|↑|
      // | | | | |S|

      it('heads to the target', () => {
        route = gridPosition.calculateIdealRoute(xCoordinate, yCoordinate);

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[4, 3], [3, 3], [3, 2], [2, 2], [2, 1], [1, 1], [1, 0], [0, 0]]),
        );
      });
    });

    describe('when in top right corner, and target is bottom left', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(4, 0, gridWidth, gridHeight, treePositions);
        xCoordinate = 0;
        yCoordinate = 4;
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // | | | | |S|
      // | | | |←|↓|
      // | | |←|↓| |
      // | |←|↓| | |
      // |T|↓| | | |

      it('heads to the target', () => {
        route = gridPosition.calculateIdealRoute(xCoordinate, yCoordinate);

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[4, 1], [3, 1], [3, 2], [2, 2], [2, 3], [1, 3], [1, 4], [0, 4]]),
        );
      });
    });

    describe('when in top left corner, and target is bottom right', () => {
      beforeEach(() => {
        gridPosition = new GridPosition(0, 0, gridWidth, gridHeight, treePositions);
        xCoordinate = 4;
        yCoordinate = 4;
      });

      // Diagram showing start position (S), target position (T), and expected route
      //
      // |S| | | | |
      // |↓|→| | | |
      // | |↓|→| | |
      // | | |↓|→| |
      // | | | |↓|T|

      it('heads to the target', () => {
        route = gridPosition.calculateIdealRoute(xCoordinate, yCoordinate);

        expect(JSON.stringify(route)).toEqual(
          JSON.stringify([[0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4], [4, 4]]),
        );
      });
    });
  });
});
