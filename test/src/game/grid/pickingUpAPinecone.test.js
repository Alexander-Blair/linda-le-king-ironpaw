import Grid from '../../../../src/game/grid';
import GridPosition from '../../../../src/game/gridPosition';
import {
  pickUpAvailablePinecone,
} from '../../../../src/redux/actions';

describe('Lumberjack picking up a pinecone', () => {
  const treePositions = [];
  const gridWidth = 10;
  const gridHeight = 10;
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
      lumberjackMaxPinecones: 10,
      treePositions,
    };
    const bearGridPosition = new GridPosition(
      [9, 9], gridWidth, gridHeight, treePositions,
    );
    const lumberjackGridPosition = new GridPosition(
      [0, 0], gridWidth, gridHeight, treePositions,
    );
    grid = new Grid(
      gameConfig, store, lumberjackGridPosition, bearGridPosition,
    );
  });

  it('can successfully pick up a pinecone', () => {
    expect(grid.lumberjack().numberOfPinecones()).toEqual(0);

    grid.moveLumberjack('down');
    for (let i = 0; i < 5; i += 1) grid.moveLumberjack('right');

    expect(grid.lumberjack().numberOfPinecones()).toEqual(1);
    expect(store.dispatch).toHaveBeenCalledWith(pickUpAvailablePinecone(1));
  });
});
