document.addEventListener('DOMContentLoaded', () => {
  const grid = new Grid(10, 10, 3);

  const gridRenderer = new GridRenderer(
    grid,
    document.querySelector('#grid'),
    document.querySelector('#lifebar'),
    document.querySelector('#scoreboard'),
  );

  const pageNavigator = new PageNavigator(
    document.querySelector('.introPage'),
    document.querySelector('.loadingPage'),
    document.querySelector('.gamePage'),
    document.querySelector('.gameOverPage'),
    document.querySelector('.instructions'),
  );
  let bearMovementInterval;

  // Buttons
  const newGameBtn = document.querySelector('#newGameBtn');
  const instructionsBtn = document.querySelector('#instructionsBtn');
  const loadGame = document.querySelector('#loadGame');
  const restartBtn = document.querySelector('.restartBtn');
  const audio = document.querySelector('#introMusic');

  function loseGame() {
    gridRenderer.hideCells();
    grid.innerHTML = '';
    window.clearInterval(bearMovementInterval);
    gamePage.classList.add('hidden');
    gameOverPage.classList.remove('hidden');
  }

  function spawnPinecone(cellDivs) {
    const bearIndex = grid.bearGridPosition().getCurrentCellIndex();
    let pineconeIndex;

    window.setTimeout(() => {
      pineconeIndex = Math.floor(Math.random() * grid.numberOfCells());
      while (!grid.getCell(pineconeIndex).isHabitable() || pineconeIndex === bearIndex) {
        pineconeIndex = Math.floor(Math.random() * grid.numberOfCells());
      }
      cellDivs[pineconeIndex].classList.add('pinecone');
    }, 1000);
  }

  function updateLumberjackRendering(cellDivs) {
    if (grid.lumberjack().isDead()) loseGame();

    gridRenderer.renderLumberjack();

    if (grid.lumberjack().isHurt()) {
      grid.lumberjack().loseLife();
      grid.lumberjack().setExploring();
    }
  }

  function checkForAttack(cellDivs) {
    if (grid.isBearAttacking()) {
      gridRenderer.updateLifebar();
      grid.lumberjack().setHurt();
      grid.bear().setHurt();
    }
  }

  function moveBear(cellDivs) {
    const possibleDirections = ['up', 'down', 'left', 'right'];

    let bearMoved = false;

    while (!bearMoved) {
      const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
      if (grid.moveBear(direction)) bearMoved = true;
    }

    grid.bear().setExploring();

    checkForAttack(cellDivs);
    updateLumberjackRendering(cellDivs);
    gridRenderer.renderBear();
  }

  function moveLumberjack(direction, cellDivs) {
    if (direction === undefined) return;

    grid.moveLumberjack(direction);
    gridRenderer.animateLumberjack(direction);

    const newLumberjackIndex = grid.lumberjackGridPosition().getCurrentCellIndex();

    if (cellDivs[newLumberjackIndex].classList.contains('pinecone')) {
      cellDivs[newLumberjackIndex].classList.remove('pinecone');
      if (grid.lumberjack().canPickUpPineCone()) {
        grid.lumberjack().pickUpPineCone();
        spawnPinecone(cellDivs);
      }
    }
  }

  // Event listeners
  instructionsBtn.addEventListener('click', () => {
    pageNavigator.showInstructions();
  });

  newGameBtn.addEventListener('click', () => {
    pageNavigator.showLoadingPage();
  });

  loadGame.addEventListener('click', () => {
    pageNavigator.showGamePage();
    gridRenderer.init();
    gridRenderer.renderLumberjack();
    gridRenderer.renderBear();
    bearMovementInterval = window.setInterval(() => {
      moveBear(gridRenderer.cellElements());
    }, 1000);

    spawnPinecone(gridRenderer.cellElements());
    audio.play();
  });

  restartBtn.addEventListener('click', () => {
    location.reload();
  });

  gridRenderer.updateScoreboard();

  // ARROW BINDING
  document.addEventListener('keyup', () => {
    grid.lumberjack().setExploring();
  });
  document.addEventListener('keydown', (e) => {
    const code = e.keyCode;
    const direction = {
      87: 'up',
      83: 'down',
      65: 'left',
      68: 'right',
    }[code];

    moveLumberjack(direction, gridRenderer.cellElements());
    checkForAttack(gridRenderer.cellElements());
    updateLumberjackRendering(gridRenderer.cellElements());
    gridRenderer.renderBear();
  }, false);
});
