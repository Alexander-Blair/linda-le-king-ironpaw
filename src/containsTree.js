const containsTree = (treePositions, position) => (
  treePositions.some((treePosition) => (
    treePosition[0] === position[0] && treePosition[1] === position[1]
  ))
);

export default containsTree;
