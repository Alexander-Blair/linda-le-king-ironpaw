(function(exports) {
  function GridRenderer(
    grid,
    gridElement,
    lifebarElement,
    scoreboardElement,
  ) {
    this._grid = grid;
    this._gridElement = gridElement;
    this._cellElements = [];
    this._lifebarElement = lifebarElement;
    this._scoreboardElement = scoreboardElement;
  }

  GridRenderer.prototype = {
    init() {
      this.initializeCells();
      this.initializeLifebar();
      this.initializeTrees();
    },
    cellElements() { return this._cellElements; },
    updateScoreboard() { this._scoreboardElement.innerHTML = `Score: ${this._grid.score()}`; },
    initializeTrees() {
      this._grid.cells().forEach((cell, index) => {
        if (!cell.isHabitable()) this.cellElements()[index].classList.add('tree');
      });
    },
    initializeCells() {
      for (let i = 0; i < this._grid.numberOfCells(); i += 1) {
        const div = document.createElement('div');
        this._gridElement.appendChild(div);
        this._cellElements.push(div);
      }
    },
    initializeLifebar() {
      for (let i = 0; i < this._grid.lumberjack().numberOfLives(); i += 1) {
        const life = document.createElement('img');
        life.src = './images/heart.png';
        this._lifebarElement.appendChild(life);
      }
    },
    hideCells() { this._cellElements = []; },
    renderLumberjack() {
      let className;

      const previousCellIndex = this._grid.lumberjackGridPosition().getPreviousCellIndex();
      const currentCellIndex = this._grid.lumberjackGridPosition().getCurrentCellIndex();

      if (previousCellIndex !== undefined) {
        this._cellElements[previousCellIndex].classList.remove(
          'lumberjack', 'lumberjackAttack', 'lumberjackRight', 'lumberjackLeft', 'lumberjackHurt',
        );
      }

      if (this._grid.lumberjack().isExploring()) className = 'lumberjack';
      else if (this._grid.lumberjack().isAttacking()) className = 'lumberjackAttack';
      else if (this._grid.lumberjack().isHurt()) className = 'lumberjackHurt';
      this._cellElements[currentCellIndex].classList.add(className);
    },
    animateLumberjack(direction) {
      const animations = {
        up: 'lumberjackRight',
        down: 'lumberjackRight',
        left: 'lumberjackLeft',
        right: 'lumberjackRight',
      };

      const lumberjackIndex = this._grid.lumberjackGridPosition().getCurrentCellIndex();
      this._cellElements[lumberjackIndex].classList.add(animations[direction]);
      setTimeout(() => {
        this._cellElements[lumberjackIndex].classList.remove(animations[direction]);
      }, 200);
    },
    renderBear() {
      let className;

      const previousCellIndex = this._grid.bearGridPosition().getPreviousCellIndex();
      const currentCellIndex = this._grid.bearGridPosition().getCurrentCellIndex();

      if (previousCellIndex !== undefined) {
        this._cellElements[previousCellIndex].classList.remove('bearAttack', 'bearHurt', 'bear');
      }

      if (this._grid.bear().isExploring()) className = 'bear';
      else if (this._grid.bear().isAttacking()) className = 'bearAttack';
      else if (this._grid.bear().isHurt()) className = 'bearHurt';
      this._cellElements[currentCellIndex].classList.add(className);
    },
    updateLifebar() {
      const startingLives = this._lifebarElement.children.length;
      const currentLives = this._grid.lumberjack().numberOfLives();

      for (let i = 0; i < startingLives; i += 1) {
        const lifeElementIndex = startingLives - i - 1;
        if (i >= currentLives - 1) {
          this._lifebarElement.children[lifeElementIndex].classList.add('hidden');
        }
      }
    },
  };

  exports.GridRenderer = GridRenderer;
})(this);
