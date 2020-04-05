const bearClassMappings = {
  exploring: 'bear',
  attacking: 'bearAttack',
  hurt: 'bearHurt',
};

const lumberjackClassMappings = {
  exploring: 'lumberjack',
  attacking: 'lumberjackAttack',
  hurt: 'lumberjackHurt',
};

const lumberjackAnimations = {
  up: 'lumberjackRight',
  down: 'lumberjackRight',
  left: 'lumberjackLeft',
  right: 'lumberjackRight',
};

export default function GridRenderer(
  grid,
  gridElement,
  lifebarElement,
  scoreboardElement,
  windowObject,
) {
  this._grid = grid;
  this._gridElement = gridElement;
  this._cellElements = [];
  this._lifebarElement = lifebarElement;
  this._lifeElements = [];
  this._scoreboardElement = scoreboardElement;
  this._windowObject = windowObject;
}

GridRenderer.prototype = {
  init() {
    this.initializeCells();
    this.initializeLifebar();
    this.initializeTrees();
    this.renderLumberjack();
    this.renderBear();
    this.spawnPinecone();
    this.updateScoreboard();
    this.updateLifebar();
  },
  initializeTrees() {
    this._grid.treePositions().forEach((index) => {
      this._cellElements[index].classList.add('tree');
    });
  },
  initializeCells() {
    const newGridElement = this._gridElement.cloneNode(false);
    this._gridElement.parentNode.replaceChild(newGridElement, this._gridElement);
    this._gridElement = newGridElement;

    for (let i = 0; i < this._grid.numberOfCells(); i += 1) {
      const div = document.createElement('div');
      this._gridElement.appendChild(div);
      this._cellElements.push(div);
    }
  },
  initializeLifebar() {
    const newLifebarElement = this._lifebarElement.cloneNode(false);
    newLifebarElement.innerHTML = 'Lives: ';
    this._lifebarElement.parentNode.replaceChild(newLifebarElement, this._lifebarElement);
    this._lifebarElement = newLifebarElement;

    for (let i = 0; i < this._grid.lumberjack().numberOfLives(); i += 1) {
      const div = document.createElement('div');
      div.classList.add('life');
      this._lifebarElement.appendChild(div);
      this._lifeElements.push(div);
    }
  },
  hideCells() { this._cellElements.forEach((e) => e.classList.add('hidden')); },
  renderLumberjack() {
    const previousCellIndex = this._grid.lumberjackGridPosition().getPreviousCellIndex();
    const currentCellIndex = this._grid.lumberjackGridPosition().getCurrentCellIndex();

    if (previousCellIndex !== undefined) {
      this._cellElements[previousCellIndex].classList.remove(
        'lumberjack', 'lumberjackAttack', 'lumberjackRight', 'lumberjackLeft', 'lumberjackHurt',
      );
    }
    const className = lumberjackClassMappings[this._grid.lumberjack().state()];

    this._cellElements[currentCellIndex].classList.add(className);
  },
  animateLumberjack(direction) {
    const lumberjackIndex = this._grid.lumberjackGridPosition().getCurrentCellIndex();
    this._cellElements[lumberjackIndex].classList.add(lumberjackAnimations[direction]);
    setTimeout(() => {
      this._cellElements[lumberjackIndex].classList.remove(lumberjackAnimations[direction]);
    }, 200);
  },
  renderBear() {
    const previousCellIndex = this._grid.bearGridPosition().getPreviousCellIndex();
    const currentCellIndex = this._grid.bearGridPosition().getCurrentCellIndex();

    if (previousCellIndex !== undefined) {
      this._cellElements[previousCellIndex].classList.remove('bearAttack', 'bearHurt', 'bear');
    }

    const className = bearClassMappings[this._grid.bear().state()];
    this._cellElements[currentCellIndex].classList.add(className);
  },
  updateLifebar() {
    const startingLives = this._lifeElements.length;
    const currentLives = this._grid.lumberjack().numberOfLives();

    for (let i = 0; i < startingLives; i += 1) {
      const lifeElementIndex = startingLives - i - 1;
      if (i >= currentLives) {
        this._lifeElements[lifeElementIndex].classList.add('hidden');
      }
    }
  },
  updateScoreboard() { this._scoreboardElement.innerHTML = `Score: ${this._grid.score()}`; },
  spawnPinecone() {
    const bearIndex = this._grid.bearGridPosition().getCurrentCellIndex();
    let pineconeIndex;

    this._windowObject.setTimeout(() => {
      pineconeIndex = Math.floor(Math.random() * this._grid.numberOfCells());
      while (this._grid.treePositions().includes(pineconeIndex) || pineconeIndex === bearIndex) {
        pineconeIndex = Math.floor(Math.random() * this._grid.numberOfCells());
      }
      this._cellElements[pineconeIndex].classList.add('pinecone');
    }, 1000);
  },
  cellContainsPinecone(cellIndex) {
    return this._cellElements[cellIndex].classList.contains('pinecone');
  },
  removePinecone(cellIndex) {
    this._cellElements[cellIndex].classList.remove('pinecone');
  },
};
