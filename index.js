document.addEventListener('DOMContentLoaded', () => {
  const gridHeight = 10;
  const gridWidth = 10;
  const startingLives = 3;

  const grid = new Grid(gridHeight, gridWidth, startingLives);

  let cellDivs = [];

  // DOM variables
  const timer = document.querySelector('#timer');
  const scoreboard = document.querySelector('#scoreboard');
  const lifebarElement = document.querySelector('#lifebar');
  let score = 0;
  let bearMovementInterval;

  // PAGES
  const introPage = document.querySelector('.introPage');
  const loadingPage = document.querySelector('.loadingPage');
  const gamePage = document.querySelector('.gamePage');
  const gameOverPage = document.querySelector('.gameOverPage');

  // Buttons
  const newGameBtn = document.querySelector('#newGameBtn');
  const instructionsBtn = document.querySelector('#instructionsBtn');
  const loadGame = document.querySelector('#loadGame');
  const restartBtn = document.querySelector('.restartBtn');
  const audio = document.querySelector('#introMusic');
  const instructions = document.querySelector('.instructions');

  function createLife() {
    for (let i = 0; i < grid.lumberjack().numberOfLives(); i += 1) {
      const life = document.createElement('img');
      life.src = './images/heart.png';
      lifebarElement.appendChild(life);
    }
  }

  function createCells(gridElement, cellDivs) {
    for (let i = 0; i < grid.numberOfCells(); i += 1) {
      const div = document.createElement('div');
      gridElement.appendChild(div);
      cellDivs.push(div);
    }
  }

  function generateTrees(cellDivs) {
    grid.cells().forEach((cell, index) => {
      if (!cell.isHabitable()) cellDivs[index].classList.add('tree');
    });
  }

  function loseGame() {
    cellDivs = [];
    grid.innerHTML = '';
    window.clearInterval(bearMovementInterval);
    gamePage.classList.add('hidden');
    gameOverPage.classList.remove('hidden');
  }

  function updateScoreboard() {
    scoreboard.innerHTML = `Score: ${score}`;
  }

  function renderLumberjack(cellDivs, lumberjack) {
    const lumberjackIndex = grid.lumberjackGridPosition().getCurrentCellIndex();

    cellDivs[lumberjackIndex].classList.add('lumberjack');
  }

  function renderBear(cellDivs) {
    const bearIndex = grid.bearGridPosition().getCurrentCellIndex();

    cellDivs[bearIndex].classList.add('bear');
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
    let lumberjackClassName;

    if (grid.lumberjack().isDead()) loseGame();

    const lumberjackIndex = grid.lumberjackGridPosition().getCurrentCellIndex();

    if (grid.lumberjack().isExploring()) lumberjackClassName = 'lumberjack';
    else if (grid.lumberjack().isAttacking()) {
      lumberjackClassName = 'lumberjackAttack';
      if (grid.lumberjack().canThrowPineCone()) grid.lumberjack().throwPineCone();
      grid.lumberjack().setExploring();
    } else if (grid.lumberjack().isHurt()) {
      lumberjackClassName = 'lumberjackHurt';
      score -= 1;
      updateScoreboard();
      grid.lumberjack().loseLife();
      grid.lumberjack().setExploring();
    }
    cellDivs[lumberjackIndex].classList.add(lumberjackClassName);
  }

  function updateBearRendering(cellDivs) {
    let bearClassName;
    const bearIndex = grid.bearGridPosition().getCurrentCellIndex();

    cellDivs[bearIndex].classList.remove('bearAttack', 'bearHurt');

    if (grid.bear().isExploring()) bearClassName = 'bear';
    else if (grid.bear().isAttacking()) bearClassName = 'bearAttack';
    else if (grid.bear().isHurt()) {
      bearClassName = 'bearHurt';
      score += 1;
    }

    cellDivs[bearIndex].classList.add(bearClassName);
  }

  function checkForAttack(cellDivs) {
    if (grid.isBearAttacking()) {
      score -= 1;
      updateScoreboard();
      grid.lumberjack().setHurt();
      grid.bear().setHurt();
      if (lifebarElement.lastChild) lifebarElement.removeChild(lifebarElement.lastChild);
    }
  }

  function moveBear(cellDivs) {
    const bearPosition = ['up', 'down', 'left', 'right'];
    const bearIndex = grid.bearGridPosition().getCurrentCellIndex();
    cellDivs[bearIndex].classList.remove('bear', 'bearHurt', 'bearAttack');
    const direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
    grid.bear().setExploring();

    grid.moveBear(direction);
    const newBearIndex = grid.bearGridPosition().getCurrentCellIndex();

    checkForAttack(cellDivs);
    updateLumberjackRendering(cellDivs);
    updateBearRendering(cellDivs);
  }

  function moveLumberjack(direction, cellDivs) {
    if (direction === undefined) return;

    const currentLumberjackIndex = grid.lumberjackGridPosition().getCurrentCellIndex();

    cellDivs[currentLumberjackIndex].classList.remove('lumberjack', 'lumberjackAttack', 'lumberjackRight', 'lumberjackLeft');

    grid.moveLumberjack(direction);

    const newLumberjackIndex = grid.lumberjackGridPosition().getCurrentCellIndex();

    cellDivs[newLumberjackIndex].classList.add(animations[direction]);
    setTimeout(() => {
      cellDivs[newLumberjackIndex].classList.remove(animations[direction]);
    }, 200);

    if (cellDivs[newLumberjackIndex].classList.contains('pinecone')) {
      cellDivs[newLumberjackIndex].classList.remove('pinecone');
      if (grid.lumberjack().canPickUpPineCone()) {
        grid.lumberjack().pickUpPineCone();
        spawnPinecone(cellDivs);
      }
    }
  }
  // GAMEPLAY VARIABLES
  const animations = {
    up: 'lumberjackRight',
    down: 'lumberjackRight',
    left: 'lumberjackLeft',
    right: 'lumberjackRight',
  };

  // hide pages for the introPage
  loadingPage.classList.add('hidden');
  gamePage.classList.add('hidden');
  gameOverPage.classList.add('hidden');
  instructions.classList.add('hidden');

  // Event listeners
  instructionsBtn.addEventListener('click', () => {
    instructions.classList.remove('hidden');
  });

  newGameBtn.addEventListener('click', () => {
    introPage.classList.add('hidden');
    loadingPage.classList.remove('hidden');
  });

  loadGame.addEventListener('click', () => {
    loadingPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    createCells(document.querySelector('#grid'), cellDivs);
    createLife();
    generateTrees(cellDivs);
    renderLumberjack(cellDivs, grid.lumberjack());
    renderBear(cellDivs);
    bearMovementInterval = window.setInterval(() => {
      moveBear(cellDivs);
    }, 1000);

    spawnPinecone(cellDivs);
    score = 0;
    audio.play();
  });

  restartBtn.addEventListener('click', () => {
    location.reload();
  });

  updateScoreboard();

  let tick = 180;
  const countdown = setInterval(() => {
    tick -= 1;
    timer.innerHTML = `Time: ${tick}`;
    if (tick <= 0) {
      clearInterval(countdown);
      loseGame();
    }
  }, 1000);

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

    moveLumberjack(direction, cellDivs);
    checkForAttack(cellDivs);
    updateLumberjackRendering(cellDivs);
    updateBearRendering(cellDivs);
  }, false);
});
