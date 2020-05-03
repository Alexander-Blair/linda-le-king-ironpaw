export default function generateGameConfig() {
  const gridWidth = 12;
  const gridHeight = 12;
  const lumberjackStartingLives = 3;
  const treePositions = [
    [0, 2], [1, 2], [1, 6], [1, 7], [1, 8], [2, 2], [4, 3], [4, 4], [4, 5],
    [7, 0], [7, 6], [7, 7], [7, 8], [8, 0], [8, 3], [8, 4], [9, 0],
  ];
  const bearStartSpeed = 150;
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
