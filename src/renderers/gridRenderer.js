import {
  lumberjackExploring,
  lumberjackAttacking,
  lumberjackHurt,
  bearExploring,
  bearAttacking,
  bearHurt,
} from '../game/characterStatuses';

const bearClassMappings = {
  [bearExploring]: 'bear',
  [bearAttacking]: 'bearAttack',
  [bearHurt]: 'bearHurt',
};

const firedPineconeMappings = {
  left: 'firedPineconeLeft',
  right: 'firedPineconeRight',
  up: 'firedPineconeLeft',
  down: 'firedPineconeRight',
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
  pineconeInventoryElement,
  scoreboardElement,
  roundNumberElement,
  timerElement,
  store,
  gameConfig,
) {
  this._gridElement = gridElement;
  this._cellElements = [];
  this._lifebarElement = lifebarElement;
  this._lifeElements = [];
  this._pineconeInventoryElement = pineconeInventoryElement;
  this._pineconeInventoryElements = [];
  this._scoreboardElement = scoreboardElement;
  this._roundNumberElement = roundNumberElement;
  this._timerElement = timerElement;
  this._store = store;
  this._gameConfig = gameConfig;

  store.subscribe(this.render.bind(this));
}

GridRenderer.prototype = {
  init() {
    this.initializeCells();
    this.initializeLifebar();
    this.initializePineconeInventory();
    this.initializeTrees();
    this.render();
  },
  render() {
    console.log(this._store.getState());
    this.renderLumberjack();
    this.renderBear();
    this.renderAvailablePinecone();
    this.renderFiredPinecone();
    this.updateLifebar();
    this.updatePineconeInventory();
    this.updateScoreboard();
    this.updateTimer();
    this.updateRoundNumber();
    if (this._previousState && this.lumberjack().index !== this.lumberjackLastStateIndex()) {
      this.animateLumberjack();
    }
    this._previousState = this._store.getState();
  },
  bear() { return this._store.getState().bear; },
  lumberjack() { return this._store.getState().lumberjack; },
  availablePinecone() { return this._store.getState().availablePinecone; },
  firedPinecone() { return this._store.getState().firedPinecone; },
  gameStats() { return this._store.getState().gameStats; },
  initializeTrees() {
    this._gameConfig.treePositions.forEach((position) => {
      const index = position[0] + position[1] * this._gameConfig.gridWidth;
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
  initializePineconeInventory() {
    const newPineconeElement = this._pineconeInventoryElement.cloneNode(false);
    this._pineconeInventoryElement
      .parentNode
      .replaceChild(newPineconeElement, this._pineconeInventoryElement);
    this._pineconeInventoryElement = newPineconeElement;

    for (let i = 0; i < this.lumberjack().maxPinecones; i += 1) {
      const div = document.createElement('div');
      div.classList.add('lumberjack-pinecone', 'hidden');
      this._pineconeInventoryElement.appendChild(div);
      this._pineconeInventoryElements.push(div);
    }
  },
  initializeLifebar() {
    const newLifebarElement = this._lifebarElement.cloneNode(false);
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
  lumberjackLastStateIndex() {
    if (!this._previousState) return undefined;
    return this._previousState.lumberjack.index;
  },
  renderLumberjack() {
    const previousCellIndex = this.lumberjackLastStateIndex();
    const currentCellIndex = this.lumberjack().index;

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
    const lumberjackIndex = this.lumberjack().index;
    const { direction } = this.lumberjack();

    if (lumberjackIndex !== undefined) {
      this._cellElements[lumberjackIndex].classList.add(lumberjackAnimations[direction]);
      setTimeout(() => {
        this._cellElements[lumberjackIndex].classList.remove(lumberjackAnimations[direction]);
      }, 200);
    }
  },
  renderBear() {
    const previousCellIndex = this._previousState ? this._previousState.bear.index : undefined;
    const currentCellIndex = this.bear().index;

    if (previousCellIndex !== undefined && previousCellIndex !== currentCellIndex) {
      this._cellElements[previousCellIndex].classList.remove('bearAttack', 'bearHurt', 'bear');
    }

    if (currentCellIndex !== undefined) {
      const className = bearClassMappings[this.bear().status];
      this._cellElements[currentCellIndex].classList.add(className);
    }
  },
  updatePineconeInventory() {
    const { numberOfPinecones, maxPinecones } = this.lumberjack();

    for (let i = 0; i < maxPinecones; i += 1) {
      if (numberOfPinecones > i) {
        this._pineconeInventoryElements[i].classList.remove('hidden');
      } else this._pineconeInventoryElements[i].classList.add('hidden');
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
  updateScoreboard() { this._scoreboardElement.innerHTML = `Score: ${this.gameStats().score}`; },
  updateTimer() {
    this._timerElement.innerHTML = `Time: ${this.gameStats().secondsRemaining}`;
  },
  updateRoundNumber() {
    this._roundNumberElement.innerHTML = `Round: ${this.gameStats().roundNumber}`;
  },
  renderAvailablePinecone() {
    const currentIndex = this.availablePinecone().index;
    const previousIndex = this._previousState
      ? this._previousState.availablePinecone.index : undefined;

    if (currentIndex !== undefined) this._cellElements[currentIndex].classList.add('pinecone');
    if (previousIndex !== undefined && previousIndex !== currentIndex) {
      this._cellElements[previousIndex].classList.remove('pinecone');
    }
  },
  renderFiredPinecone() {
    const currentIndex = this.firedPinecone().index;
    const previousIndex = this._previousState
      ? this._previousState.firedPinecone.index : undefined;
    const cssClass = firedPineconeMappings[this.firedPinecone().direction];

    if (currentIndex !== undefined) this._cellElements[currentIndex].classList.add(cssClass);
    if (previousIndex !== undefined && previousIndex !== currentIndex) {
      this._cellElements[previousIndex].classList.remove('firedPineconeLeft', 'firedPineconeRight');
    }
  },
};
