export default function TreePositionGenerator(gameConfig) {
  this._gridWidth = gameConfig.gridWidth;
  this._gridHeight = gameConfig.gridHeight;
}

TreePositionGenerator.prototype = {
  withinBounds(position) {
    return position[0] >= 0
      && position[0] < this._gridWidth
      && position[1] >= 0
      && position[1] < this._gridHeight;
  },
  onTheEdge(group) {
    return [this._gridWidth - 1, 0].some((verticalEdge) => (
      group.every((position) => position[0] === verticalEdge)
    )) || [this._gridHeight - 1, 0].some((horizontalEdge) => (
      group.every((position) => position[1] === horizontalEdge)
    ));
  },
  isValidGroup(group) {
    return group.every((position) => this.withinBounds(position))
      && !this.onTheEdge(group);
  },
  possibleTreeGroups(initialPosition, groupLength) {
    return [[0, 1], [1, 0], [0, -1], [-1, 0]]
      .reduce((possibilities, [xIncrement, yIncrement]) => {
        const possibleGroup = [initialPosition];

        while (possibleGroup.length < groupLength) {
          const lastPosition = possibleGroup[possibleGroup.length - 1];

          possibleGroup.push([lastPosition[0] + xIncrement, lastPosition[1] + yIncrement]);
        }
        if (this.isValidGroup(possibleGroup)) possibilities.push(possibleGroup);
        return possibilities;
      }, []);
  },
};
