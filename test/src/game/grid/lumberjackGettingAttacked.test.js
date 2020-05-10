import Grid from '../../../../src/game/grid';
import GridPosition from '../../../../src/game/gridPosition';
import { lumberjackHurt, bearAttacking } from '../../../../src/game/statuses';
import {
  updateLumberjackStatus,
  updateBearStatus,
} from '../../../../src/redux/actions';

describe('Lumberjack getting attacked by a bear', () => {
  const gridWidth = 10;
  const gridHeight = 10;
  const treePositions = [];
  const store = {
    dispatch: jest.fn(),
  };
  let grid;

  beforeEach(() => {
    const gameConfig = {
      gridWidth,
      gridHeight,
      initialPineconePosition: [5, 1],
      lumberjackStartingLives: 3,
      treePositions,
    };
    const bearGridPosition = new GridPosition(
      0, 5, gridWidth, gridHeight, treePositions,
    );
    const lumberjackGridPosition = new GridPosition(
      0, 0, gridWidth, gridHeight, treePositions,
    );
    grid = new Grid(
      gameConfig, store, lumberjackGridPosition, bearGridPosition,
    );
    grid = new Grid(gameConfig, store, lumberjackGridPosition, bearGridPosition);
  });

  describe('when Lumberjack steps into the Bear', () => {
    it('removes a life from the Lumberjack', () => {
      expect(grid.lumberjack().numberOfLives()).toEqual(3);

      for (let i = 0; i < 5; i += 1) grid.moveLumberjack('down');

      expect(grid.lumberjack().numberOfLives()).toEqual(2);
    });

    it('sets the correct statuses', () => {
      for (let i = 0; i < 5; i += 1) grid.moveLumberjack('down');

      expect(store.dispatch).toHaveBeenCalledWith(updateLumberjackStatus(lumberjackHurt));
      expect(store.dispatch).toHaveBeenCalledWith(updateBearStatus(bearAttacking));
    });
  });

  describe('when Bear steps into the Lumberjack', () => {
    it('removes a life from the Lumberjack', () => {
      expect(grid.lumberjack().numberOfLives()).toEqual(3);

      for (let i = 0; i < 5; i += 1) grid.moveBear();

      expect(grid.lumberjack().numberOfLives()).toEqual(2);
    });

    it('sets the correct statuses', () => {
      for (let i = 0; i < 5; i += 1) grid.moveBear();

      expect(store.dispatch).toHaveBeenCalledWith(updateLumberjackStatus(lumberjackHurt));
      expect(store.dispatch).toHaveBeenCalledWith(updateBearStatus(bearAttacking));
    });
  });
});
