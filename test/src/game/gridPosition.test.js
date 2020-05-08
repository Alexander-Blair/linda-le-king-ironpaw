import GridPosition from '../../../src/game/gridPosition';

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
      treePositions = [[5, 1]];

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
});
