import Grid from '../../../../src/game/grid';
import GridPosition from '../../../../src/game/gridPosition';
import { bearHurt } from '../../../../src/game/statuses';
import {
  moveFiredPinecone,
  throwPinecone,
  updateBearStatus,
} from '../../../../src/redux/actions';

describe('Lumberjack throwing a pinecone into open space', () => {
  const gridWidth = 10;
  const gridHeight = 10;
  const treePositions = [];
  let grid;
  let store;

  beforeEach(() => {
    store = { dispatch: jest.fn() };
    const gameConfig = {
      gridWidth,
      gridHeight,
      initialPineconePosition: [1, 0],
      lumberjackStartingLives: 3,
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

  it('cannot trigger pinecone throw when lumberjack has no pinecones', () => {
    expect(grid.lumberjack().numberOfPinecones()).toEqual(0);
    expect(grid.throwPinecone()).toBe(false);
  });

  it('can successfully throw a pinecone after pickup', () => {
    grid.moveLumberjack('right');
    expect(grid.lumberjack().numberOfPinecones()).toEqual(1);

    expect(grid.throwPinecone()).toBe(true);

    expect(grid.lumberjack().numberOfPinecones()).toEqual(0);
    expect(store.dispatch).toHaveBeenCalledWith(
      throwPinecone(1, 0, 'right', gridWidth),
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      moveFiredPinecone(2, 0, gridWidth),
    );
  });

  it('only lets the pinecone travel 5 squares', () => {
    grid.moveLumberjack('right');
    grid.throwPinecone();

    expect(store.dispatch).toHaveBeenCalledWith(moveFiredPinecone(2, 0, gridWidth));

    for (let i = 3; i < 7; i += 1) {
      expect(grid.movePinecone()).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(moveFiredPinecone(i, 0, gridWidth));
    }

    expect(grid.movePinecone()).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalledWith(moveFiredPinecone(8, 0, gridWidth));
  });
});

describe('Lumberjack throwing a pinecone into a tree', () => {
  const treePositions = [[6, 0]];
  const gridWidth = 10;
  const gridHeight = 10;
  let grid;
  let store;

  beforeEach(() => {
    store = { dispatch: jest.fn() };
    const gameConfig = {
      gridWidth,
      gridHeight,
      initialPineconePosition: [1, 0],
      lumberjackStartingLives: 3,
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

  it('only lets the pinecone travel until before the tree', () => {
    grid.moveLumberjack('right');
    grid.throwPinecone();

    expect(store.dispatch).toHaveBeenCalledWith(moveFiredPinecone(2, 0, gridWidth));

    for (let i = 3; i < 6; i += 1) {
      expect(grid.movePinecone()).toBe(true);
      expect(store.dispatch).toHaveBeenCalledWith(moveFiredPinecone(i, 0, gridWidth));
    }

    expect(grid.movePinecone()).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalledWith(moveFiredPinecone(6, 0, gridWidth));
  });
});

describe('Lumberjack hitting the bear with a pinecone', () => {
  const treePositions = [];
  const gridWidth = 10;
  const gridHeight = 10;
  let grid;
  let store;

  beforeEach(() => {
    store = { dispatch: jest.fn() };
    const gameConfig = {
      gridWidth,
      gridHeight,
      initialPineconePosition: [1, 0],
      lumberjackStartingLives: 3,
      treePositions,
    };
    const bearGridPosition = new GridPosition(
      [6, 0], gridWidth, gridHeight, treePositions,
    );
    const lumberjackGridPosition = new GridPosition(
      [0, 0], gridWidth, gridHeight, treePositions,
    );
    grid = new Grid(
      gameConfig, store, lumberjackGridPosition, bearGridPosition,
    );
  });

  it('stops when it hits the bear and issues status update', () => {
    grid.moveLumberjack('right');
    grid.throwPinecone();

    for (let i = 3; i < 7; i += 1) {
      grid.movePinecone();
      expect(store.dispatch).toHaveBeenCalledWith(moveFiredPinecone(i, 0, gridWidth));
    }

    expect(store.dispatch).toHaveBeenCalledWith(updateBearStatus(bearHurt));
    expect(store.dispatch).not.toHaveBeenCalledWith(moveFiredPinecone(7, 0, gridWidth));
  });
});

describe('Bear walking into the pinecone', () => {
  const treePositions = [];
  const gridWidth = 10;
  const gridHeight = 10;
  let grid;
  let store;

  beforeEach(() => {
    store = { dispatch: jest.fn() };
    const gameConfig = {
      gridWidth,
      gridHeight,
      initialPineconePosition: [1, 0],
      lumberjackStartingLives: 3,
      treePositions,
    };
    const bearGridPosition = new GridPosition(
      [6, 0], gridWidth, gridHeight, treePositions,
    );
    const lumberjackGridPosition = new GridPosition(
      [0, 0], gridWidth, gridHeight, treePositions,
    );
    grid = new Grid(
      gameConfig, store, lumberjackGridPosition, bearGridPosition,
    );
  });

  it('stops when it hits the bear and issues status update', () => {
    grid.moveLumberjack('right');
    grid.throwPinecone();

    expect(store.dispatch).toHaveBeenCalledWith(moveFiredPinecone(2, 0, gridWidth));

    for (let i = 3; i < 6; i += 1) {
      grid.movePinecone();
      expect(store.dispatch).toHaveBeenCalledWith(moveFiredPinecone(i, 0, gridWidth));
    }

    grid.moveBear();
    expect(store.dispatch).toHaveBeenCalledWith(updateBearStatus(bearHurt));
    expect(grid.movePinecone()).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalledWith(moveFiredPinecone(7, 0, gridWidth));
  });
});
