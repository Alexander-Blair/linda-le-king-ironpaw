document.addEventListener('DOMContentLoaded', () => {
  const gridHeight = 10;
  const gridWidth = 10;
  const lumberjackStartPosition = 0;
  const bearStartPosition = 99;
  const startingLives = 3;

  const grid = new Grid(
    gridHeight,
    gridWidth,
    lumberjackStartPosition,
    bearStartPosition,
  );
  const lumberjack = new Lumberjack(startingLives, 0)
  const bear = new Bear();

  let cellDivs = [];

  // DOM variables
  const timer = document.querySelector('#timer');
  const scoreboard = document.querySelector('#scoreboard');
  const lifebarElement = document.querySelector('#lifebar');
  let score = 0;

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
    for (let i = 0; i < lumberjack.numberOfLives(); i += 1) {
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
    gamePage.classList.add('hidden');
    gameOverPage.classList.remove('hidden');
  }

  function updateScoreboard() {
    scoreboard.innerHTML = `Score: ${score}`;
  }

  function renderLumberjack(cellDivs) {
    cellDivs[grid.lumberjackIndex()].classList.add('lumberjack');
  }

  function renderBear(cellDivs) {
    cellDivs[grid.bearIndex()].classList.add('bear');
  }

  function spawnPinecone(cellDivs) {
    let pineconeIndex;

    window.setTimeout(() => {
      pineconeIndex = Math.floor(Math.random() * grid.numberOfCells());
      while (!grid.getCell(pineconeIndex).isHabitable() || pineconeIndex === grid.bearIndex()) {
        pineconeIndex = Math.floor(Math.random() * grid.numberOfCells());
      }
      cellDivs[pineconeIndex].classList.add('pinecone');
    }, 1000);
  }

  function startBearMovement() {
    const bearPosition = ['up', 'down', 'left', 'right'];
    let direction = bearPosition[0];
    window.setInterval(() => {
      bear.setExploring();
      let nextIndex;
      switch(direction) {
        case 'right':
          nextIndex = grid.bearIndex() + 1;
          if (grid.bearIndex() % grid.width() !== grid.width() - 1 && grid.getCell(nextIndex).isHabitable()) {
            cellDivs[grid.bearIndex()].classList.remove('bear', 'bearHurt', 'bearAttack');
            grid.moveBear(nextIndex);
            cellDivs[grid.bearIndex()].classList.add('bear');
          } else {
            direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          }
          checkBear(cellDivs);
          break;
        case 'left':
          nextIndex = grid.bearIndex() - 1;
          if (grid.bearIndex() % grid.width() !== 0 && grid.getCell(nextIndex).isHabitable()) {
            cellDivs[grid.bearIndex()].classList.remove('bear', 'bearAttack', 'bearHurt');
            grid.moveBear(nextIndex);
            cellDivs[grid.bearIndex()].classList.add('bear');
          } else {
            direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          }
          checkBear(cellDivs);
          break;
        case 'down':
          nextIndex = grid.bearIndex() + grid.width();
          if (grid.bearIndex() < grid.width() * grid.height() - grid.width() && grid.getCell(nextIndex).isHabitable()) {
            cellDivs[grid.bearIndex()].classList.remove('bear', 'bearAttack', 'bearHurt');
            grid.moveBear(nextIndex);
            cellDivs[grid.bearIndex()].classList.add('bear');
          } else {
            direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          }
          checkBear(cellDivs);
          break;
        case 'up':
          nextIndex = grid.bearIndex() - grid.width();
          if (grid.bearIndex() > grid.width() - 1 && grid.getCell(nextIndex).isHabitable()) {
            cellDivs[grid.bearIndex()].classList.remove('bear', 'bearAttack', 'bearHurt');
            grid.moveBear(nextIndex);
            cellDivs[grid.bearIndex()].classList.add('bear');
          } else {
            direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          }
          checkBear(cellDivs);
          break;
        default:
          return;
      }
      updateLumberjackRendering(cellDivs);
      updateBearRendering(cellDivs);
    }, 1000);
  }

  // GAMEPLAY VARIABLES
  let className = 'lumberjack';
  const directionCodes = {
    87: 'up',
    83: 'down',
    65: 'left',
    68: 'right',
  };
  const lumberJackDirections = {
    up: {
      code: 87,
      animation: 'lumberjackRight',
      newIndex: 10,
      boundaryCondition(lumberjackIndex) {
        if (lumberjackIndex > grid.width() - 1) return true;
        return false;
      },
    },
    down: {
      code: 83,
      animation: 'lumberjackRight',
      newIndex: 10,
      boundaryCondition(lumberjackIndex) {
        if (!(lumberjackIndex > (grid.width() * grid.height()) - grid.width())) return true;
        return false;
      },
    },
    left: {
      code: 65,
      animation: 'lumberjackLeft',
      newIndex: 1,
      boundaryCondition(lumberjackIndex) {
        if (lumberjackIndex % grid.width() !== 0) return true;
        return false;
      },
    },
    right: {
      code: 68,
      animation: 'lumberjackRight',
      newIndex: 1,
      boundaryCondition(lumberjackIndex) {
        if (lumberjackIndex % grid.width() !== grid.width() - 1) return true;
        return false;
      },
    },
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
    renderLumberjack(cellDivs);
    renderBear(cellDivs);
    startBearMovement();
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

  function checkBear(cellDivs) {
    if (grid.isBearAttacking()) {
      score -= 1;
      updateScoreboard();
      lumberjack.setHurt();
      bear.setHurt();
      if (lifebarElement.lastChild) lifebarElement.removeChild(lifebarElement.lastChild);
    }
  }

  function nextCell(a, b, direction) {
    return direction === 'up' || direction === 'left' ? a - b : a + b;
  }

  function moveLumberjack(direction, cellDivs) {
    if (direction === undefined) return;

    const nextLumberjackCell = nextCell(grid.lumberjackIndex(), lumberJackDirections[direction].newIndex, direction);
    if (lumberJackDirections[direction].boundaryCondition(grid.lumberjackIndex()) && grid.getCell(nextLumberjackCell).isHabitable()) {
      cellDivs[grid.lumberjackIndex()].classList.remove('lumberjack', 'lumberjackAttack', 'lumberjackRight', 'lumberjackLeft');
      grid.moveLumberjack(nextLumberjackCell);
      cellDivs[grid.lumberjackIndex()].classList.add(lumberJackDirections[direction].animation);
      setTimeout(() => {
        cellDivs[grid.lumberjackIndex()].classList.remove(lumberJackDirections[direction].animation);
      }, 200);
    }
    // picking up pinecone and respawn
    if (cellDivs[grid.lumberjackIndex()].classList.contains('pinecone')) {
      cellDivs[grid.lumberjackIndex()].classList.remove('pinecone');
      spawnPinecone(cellDivs);
      if (lumberjack.canPickUpPineCone()) lumberjack.pickUpPineCone();
    }
  }

  function updateBearRendering(cellDivs) {
    let bearClassName;

    cellDivs[grid.bearIndex()].classList.remove('bearAttack', 'bearHurt');

    if (bear.isExploring()) bearClassName = 'bear';
    else if (bear.isAttacking()) bearClassName = 'bearAttack';
    else if (bear.isHurt()) {
      bearClassName = 'bearHurt';
      score += 1;
    }

    // show the bear in the right place
    if (cellDivs[grid.bearIndex()]) {
      cellDivs[grid.bearIndex()].classList.add(bearClassName);
    }
  }

  function updateLumberjackRendering(cellDivs) {
    if (lumberjack.isDead()) loseGame();

    if (lumberjack.isExploring()) className = 'lumberjack';
    else if (lumberjack.isAttacking()) {
      className = 'lumberjackAttack';
      if (lumberjack.canThrowPineCone()) lumberjack.throwPineCone();
      lumberjack.setExploring();
    } else if (lumberjack.isHurt()) {
      className = 'lumberjackHurt';
      score -= 1;
      updateScoreboard();
      lumberjack.loseLife();
      lumberjack.setExploring();
    }
    if (cellDivs[grid.lumberjackIndex()]) {
      cellDivs[grid.lumberjackIndex()].classList.add(className);
    }
  }

  // ARROW BINDING
  document.addEventListener('keyup', () => {
    lumberjack.setExploring();
  });
  document.addEventListener('keydown', (e) => {
    const code = e.keyCode;
    const direction = directionCodes[code];

    moveLumberjack(direction, cellDivs);
    updateLumberjackRendering(cellDivs);
    updateBearRendering(cellDivs);
    checkBear(cellDivs);
  }, false);
});
