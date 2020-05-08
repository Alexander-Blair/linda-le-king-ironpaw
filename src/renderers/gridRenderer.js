import {
  lumberjackExploring,
  lumberjackAttacking,
  lumberjackHurt,
  bearExploring,
  bearAttacking,
  bearHurt,
} from '../game/statuses';

const bearClassMappings = {
  [bearExploring]: 'bear',
  [bearAttacking]: 'bearAttack',
  [bearHurt]: 'bearHurt',
};

const lumberjackClassMappings = {
  [lumberjackExploring]: 'lumberjack',
  [lumberjackAttacking]: 'lumberjackAttack',
  [lumberjackHurt]: 'lumberjackHurt',
};

const lumberjackAnimations = {
  up: 'lumberjackRight',
  down: 'lumberjackRight',
  left: 'lumberjackLeft',
  right: 'lumberjackRight',
};

export default function GridRenderer(
  gridElement,
  lifebarElement,
  scoreboardElement,
  store,
  gameConfig,
) {
  this._gridElement = gridElement;
  this._cellElements = [];
  this._lifebarElement = lifebarElement;
  this._lifeElements = [];
  this._scoreboardElement = scoreboardElement;
  this._store = store;
  this._gameConfig = gameConfig;

  store.subscribe(this.render.bind(this));
}

GridRenderer.prototype = {
  init() {
    this.initializeCells();
    this.initializeLifebar();
    this.initializeTrees();
    this.render();
  },
  render() {
    console.log(this._store.getState());
    this.renderLumberjack();
    this.renderBear();
    this.renderPinecones();
    this.updateLifebar();
    if (this._previousState && this.lumberjackCurrentIndex() !== this.lumberjackLastStateIndex()) {
      this.animateLumberjack();
    }
    this._previousState = this._store.getState();
  },
  bear() { return this._store.getState().bear; },
  lumberjack() { return this._store.getState().lumberjack; },
  pinecone() { return this._store.getState().pinecone; },
  initializeTrees() {
    this._gameConfig.treePositions.forEach((position) => {
      const index = position[0] + position[1] * this._gameConfig.gridHeight;
      this._cellElements[index].classList.add('tree');
    });
  },
  initializeCells() {
    const newGridElement = this._gridElement.cloneNode(false);
    this._gridElement.parentNode.replaceChild(newGridElement, this._gridElement);
    this._gridElement = newGridElement;
    const numberOfCells = this._gameConfig.gridWidth * this._gameConfig.gridHeight;

    for (let i = 0; i < numberOfCells; i += 1) {
      const div = document.createElement('div');
      div.style.height = `${(100 / this._gameConfig.gridHeight)}%`;
      div.style.width = `${(100 / this._gameConfig.gridWidth)}%`;
      this._gridElement.appendChild(div);
      this._cellElements.push(div);
    }
  },
  initializeLifebar() {
    const newLifebarElement = this._lifebarElement.cloneNode(false);
    newLifebarElement.innerHTML = 'Lives: ';
    this._lifebarElement.parentNode.replaceChild(newLifebarElement, this._lifebarElement);
    this._lifebarElement = newLifebarElement;

    for (let i = 0; i < this.lumberjack().numberOfLives; i += 1) {
      const div = document.createElement('div');
      div.classList.add('life');
      this._lifebarElement.appendChild(div);
      this._lifeElements.push(div);
    }
  },
  hideCells() { this._cellElements.forEach((e) => e.classList.add('hidden')); },
  lumberjackCurrentIndex() { return this.lumberjack().index; },
  lumberjackLastStateIndex() {
    if (!this._previousState) return undefined;
    return this._previousState.lumberjack.index;
  },
  bearCurrentIndex() { return this.bear().index; },
  bearLastStateIndex() {
    if (!this._previousState) return undefined;
    return this._previousState.bear.index;
  },
  pineconeCurrentIndex() { return this.pinecone().index; },
  pineconeLastStateIndex() {
    if (!this._previousState) return undefined;
    return this._previousState.pinecone.index;
  },
  renderLumberjack() {
    const previousCellIndex = this.lumberjackLastStateIndex();
    const currentCellIndex = this.lumberjackCurrentIndex();

    if (previousCellIndex !== undefined && previousCellIndex !== currentCellIndex) {
      this._cellElements[previousCellIndex].classList.remove(
        'lumberjack', 'lumberjackAttack', 'lumberjackRight', 'lumberjackLeft', 'lumberjackHurt',
      );
    }
    if (currentCellIndex !== undefined) {
      const className = lumberjackClassMappings[this.lumberjack().status];
      this._cellElements[currentCellIndex].classList.add(className);
    }
  },
  animateLumberjack() {
    const lumberjackIndex = this.lumberjackCurrentIndex();
    const { direction } = this.lumberjack();

    if (lumberjackIndex !== undefined) {
      this._cellElements[lumberjackIndex].classList.add(lumberjackAnimations[direction]);
      setTimeout(() => {
        this._cellElements[lumberjackIndex].classList.remove(lumberjackAnimations[direction]);
      }, 200);
    }
  },
  renderBear() {
    const previousCellIndex = this.bearLastStateIndex();
    const currentCellIndex = this.bearCurrentIndex();

    if (previousCellIndex !== undefined && previousCellIndex !== currentCellIndex) {
      this._cellElements[previousCellIndex].classList.remove('bearAttack', 'bearHurt', 'bear');
    }

    if (currentCellIndex !== undefined) {
      const className = bearClassMappings[this.bear().status];
      this._cellElements[currentCellIndex].classList.add(className);
    }
  },
  updateLifebar() {
    const startingLives = this._lifeElements.length;
    const currentLives = this.lumberjack().numberOfLives;

    for (let i = 0; i < startingLives; i += 1) {
      const lifeElementIndex = startingLives - i - 1;
      if (i >= currentLives) {
        this._lifeElements[lifeElementIndex].classList.add('hidden');
      }
    }
  },
  // updateScoreboard() { this._scoreboardElement.innerHTML = `Score: ${this._grid.score()}`; },
  renderPinecones() {
    const currentIndex = this.pineconeCurrentIndex();
    const previousIndex = this.pineconeLastStateIndex();

    if (currentIndex !== undefined) {
      this._cellElements[currentIndex].classList.add('pinecone');
    }
    if (previousIndex !== undefined && previousIndex !== currentIndex) {
      this._cellElements[previousIndex].classList.remove('pinecone');
    }
  },
};
