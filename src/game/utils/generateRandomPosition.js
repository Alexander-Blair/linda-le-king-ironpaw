export default function generateRandomPosition(gridWidth, gridHeight) {
  const numberOfCells = gridHeight * gridWidth;
  const index = Math.floor(Math.random() * numberOfCells);

  return [index % gridWidth, parseInt(index / gridWidth, 10)];
}
