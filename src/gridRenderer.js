(function(exports) {
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

  function GridRenderer(
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
    },
    initializeTrees() {
      this._grid.treePositions().forEach((index) => {
        this._cellElements[index].classList.add('tree');
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
      const startingLives = this._lifebarElement.children.length;
      const currentLives = this._grid.lumberjack().numberOfLives();

      for (let i = 0; i < startingLives; i += 1) {
        const lifeElementIndex = startingLives - i - 1;
        if (i >= currentLives - 1) {
          this._lifebarElement.children[lifeElementIndex].classList.add('hidden');
        }
      }
    },
    startBearMovement() {
      this._bearMovementInterval = this._windowObject.setInterval(() => {
        const possibleDirections = ['up', 'down', 'left', 'right'];
        let bearMoved = false;

        while (!bearMoved) {
          const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
          if (this._grid.moveBear(direction)) bearMoved = true;
        }
        this._grid.bear().setExploring();
        this.renderLumberjack();
      });
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

  exports.GridRenderer = GridRenderer;
})(this);
