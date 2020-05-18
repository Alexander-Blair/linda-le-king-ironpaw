import TreePositionGenerator from '../../../src/game/treePositionGenerator';

describe('TreePositionGenerator', () => {
  let treePositionGenerator;

  describe('possibleTreeGroups', () => {
    describe('at the top edge of the grid', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      // Diagram showing start position (S) and the only possible tree group
      // | | |S| | |
      // | | |*| | |
      // | | |*| | |
      // | | | | | |
      // | | | | | |
      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns a single group', () => {
        const groups = treePositionGenerator.possibleTreeGroups([2, 0], 3);

        expect(JSON.stringify(groups)).toEqual(
          JSON.stringify([[[2, 0], [2, 1], [2, 2]]]),
        );
      });
    });

    describe('at the bottom edge of the grid', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      // Diagram showing start position (S) and the only possible tree group
      // | | | | | |
      // | | | | | |
      // | | |*| | |
      // | | |*| | |
      // | | |S| | |
      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns a single group', () => {
        const groups = treePositionGenerator.possibleTreeGroups([2, 4], 3);

        expect(JSON.stringify(groups)).toEqual(
          JSON.stringify([[[2, 4], [2, 3], [2, 2]]]),
        );
      });
    });

    describe('at the right edge of the grid', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      // Diagram showing start position (S) and the only possible tree group
      // | | | | | |
      // | | | | | |
      // | | |*|*|S|
      // | | | | | |
      // | | | | | |
      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns a single group', () => {
        const groups = treePositionGenerator.possibleTreeGroups([4, 2], 3);

        expect(JSON.stringify(groups)).toEqual(
          JSON.stringify([[[4, 2], [3, 2], [2, 2]]]),
        );
      });
    });

    describe('at the left edge of the grid', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      // Diagram showing start position (S) and the only possible tree group
      // | | | | | |
      // | | | | | |
      // |S|*|*| | |
      // | | | | | |
      // | | | | | |
      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns a single group', () => {
        const groups = treePositionGenerator.possibleTreeGroups([0, 2], 3);

        expect(JSON.stringify(groups)).toEqual(
          JSON.stringify([[[0, 2], [1, 2], [2, 2]]]),
        );
      });
    });

    describe('in top left corner', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns no group', () => {
        expect(treePositionGenerator.possibleTreeGroups([0, 0], 3)).toEqual([]);
      });
    });

    describe('in top right corner', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns no group', () => {
        expect(treePositionGenerator.possibleTreeGroups([4, 0], 3)).toEqual([]);
      });
    });

    describe('in bottom left corner', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns no group', () => {
        expect(treePositionGenerator.possibleTreeGroups([0, 4], 3)).toEqual([]);
      });
    });

    describe('in bottom right corner', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns no group', () => {
        expect(treePositionGenerator.possibleTreeGroups([4, 4], 3)).toEqual([]);
      });
    });

    describe('in the centre of the grid', () => {
      const gameConfig = { gridWidth: 5, gridHeight: 5 };

      // Diagram showing start position (S) and the four possible tree groups - one
      // in each direction
      // | | |*| | |
      // | | |*| | |
      // |*|*|S|*|*|
      // | | |*| | |
      // | | |*| | |
      beforeEach(() => {
        treePositionGenerator = new TreePositionGenerator(gameConfig);
      });

      it('returns four groups', () => {
        const groups = treePositionGenerator.possibleTreeGroups([2, 2], 3);

        expect(JSON.stringify(groups)).toEqual(
          JSON.stringify(
            [
              [[2, 2], [2, 3], [2, 4]],
              [[2, 2], [3, 2], [4, 2]],
              [[2, 2], [2, 1], [2, 0]],
              [[2, 2], [1, 2], [0, 2]],
            ],
          ),
        );
      });
    });
  });
});
