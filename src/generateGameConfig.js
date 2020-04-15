export default function generateGameConfig() {
  const gridWidth = 10;
  const gridHeight = 10;
  const lumberjackStartingLives = 3;
  const treePositions = [7, 8, 9, 20, 21, 22, 34, 38, 44, 48, 54, 61, 67, 71, 77, 81, 87];
  const bearStartSpeed = 100;
  const bearStartingXCoordinate = 9;
  const bearStartingYCoordinate = 9;
  const lumberjackStartingXCoordinate = 0;
  const lumberjackStartingYCoordinate = 0;

  return {
    gridWidth,
    gridHeight,
    lumberjackStartingLives,
    treePositions,
    bearStartSpeed,
    bearStartingXCoordinate,
    bearStartingYCoordinate,
    lumberjackStartingXCoordinate,
    lumberjackStartingYCoordinate,
  };
}
