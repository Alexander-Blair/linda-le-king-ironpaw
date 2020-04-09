import GridPosition from '../../src/gridPosition';

describe('GridPosition', () => {
  const gridWidth = 10;
  const gridHeight = 10;
  let treePositions = [];

  let gridPosition;

  describe('canMove', () => {
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
});
