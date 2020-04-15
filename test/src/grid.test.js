import Grid from '../../src/grid';
import { lumberjackExploring, lumberjackHurt } from '../../src/lumberjack';

describe('Grid', () => {
  describe('Lumberjack picking up a pinecone', () => {
    let grid;

    beforeEach(() => {
      const gameConfig = {
        bearStartingXCoordinate: 9,
        bearStartingYCoordinate: 9,
        bearStartSpeed: 1000,
        gridWidth: 10,
        gridHeight: 10,
        initialPineconeIndex: 15,
        lumberjackStartingLives: 3,
        lumberjackStartingXCoordinate: 0,
        lumberjackStartingYCoordinate: 0,
        treePositions: [],
      };
      grid = new Grid(gameConfig);
    });

    it('can successfully pick up a pinecone', () => {
      expect(grid.lumberjack().numberOfPinecones()).toEqual(0);

      grid.moveLumberjack('down');
      for (let i = 0; i < 5; i += 1) grid.moveLumberjack('right');

      expect(grid.lumberjack().numberOfPinecones()).toEqual(1);
    });
  });

  describe('Lumberjack getting attacked by a bear', () => {
    let grid;

    beforeEach(() => {
      const gameConfig = {
        bearStartingXCoordinate: 0,
        bearStartingYCoordinate: 5,
        bearStartSpeed: 1000,
        gridWidth: 10,
        gridHeight: 10,
        initialPineconeIndex: 15,
        lumberjackStartingLives: 3,
        lumberjackStartingXCoordinate: 0,
        lumberjackStartingYCoordinate: 0,
        treePositions: [],
      };
      grid = new Grid(gameConfig);
    });

    describe('when Lumberjack steps into the Bear', () => {
      it('removes a life from the Lumberjack', () => {
        expect(grid.lumberjack().numberOfLives()).toEqual(3);

        for (let i = 0; i < 5; i += 1) grid.moveLumberjack('down');

        expect(grid.lumberjack().numberOfLives()).toEqual(2);
      });

      it('sets the correct statuses', () => {
        expect(grid.lumberjack().state()).toEqual(lumberjackExploring);

        for (let i = 0; i < 5; i += 1) grid.moveLumberjack('down');

        expect(grid.lumberjack().state()).toEqual(lumberjackHurt);
      });
    });

    describe('when Bear steps into the Lumberjack', () => {
      it('removes a life from the Lumberjack', () => {
        expect(grid.lumberjack().numberOfLives()).toEqual(3);

        for (let i = 0; i < 5; i += 1) grid.moveBear('up');

        expect(grid.lumberjack().numberOfLives()).toEqual(2);
      });

      it('sets the correct statuses', () => {
        expect(grid.lumberjack().state()).toEqual(lumberjackExploring);

        for (let i = 0; i < 5; i += 1) grid.moveBear('up');

        expect(grid.lumberjack().state()).toEqual(lumberjackHurt);
      });
    });
  });
});
