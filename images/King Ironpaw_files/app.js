document.addEventListener('DOMContentLoaded', () => {

  //GLOBAL VARIABLES

  //Map variables
  const gridHeight = 10;
  const gridWidth = 10;
  const gridSize = gridHeight * gridWidth;
  let cells = [];

  //DOM variables
  const grid = document.querySelector('#grid');
  const timer = document.querySelector('#timer');
  const messageBox = document.querySelector('.messageBox');
  const lifebar = document.querySelector('#lifebar');
  const $scoreboard = $('#scoreboard');
  const screen = document.querySelector('.screen');
  let score = 0;




  // PAGES
  const introPage = document.querySelector('.introPage');
  const loadingPage = document.querySelector('.loadingPage');
  const gamePage = document.querySelector('.gamePage');
  const gameOverPage = document.querySelector('.gameOverPage');

  //Buttons
  const newGameBtn = document.querySelector('#newGameBtn');
  const instructionsBtn = document.querySelector('#instructionsBtn')
  const loadGame = document.querySelector('#loadGame');
  const restartBtn = document.querySelector('.restartBtn');
  const soundBtn = document.querySelector('.soundBtn');
  const startTV = document.querySelector('#startTV');
  const instructions = document.querySelector('.instructions');



  //GAMEPLAY VARIABLES
  let startedGame = false;
  let className = 'lumberjack';
  let bearClassName = 'bear';
  let lumberjackIndex = 0;
  let bearIndex = 99;
  let pineconeIndex = null;
  let inventory = 5;
  let numOfLives = 0;
  let lumberjackState = 0;
  let bearState =0;
  let actionCell;
  const directionCodes = {
    87: 'up',
    83: 'down',
    65: 'left',
    68: 'right'
  };
  const lumberJackDirections = {
    up: {
      lumberjackIndex: 'lumberjackIndex',
      code: 87,
      animation: 'lumberjackRight',
      newIndex: 10,
      boundaryCondition: function(lumberjackIndex) {
        if(lumberjackIndex > gridWidth-1) return true;
        else return false;
      }
    },
    down: {
      code: 83,
      animation: 'lumberjackRight',
      newIndex: 10,
      boundaryCondition: function(lumberjackIndex) {
        if(!(lumberjackIndex > (gridWidth * gridHeight) - gridWidth)) return true;
        else return false;
      }
    },
    left: {
      code: 65,
      animation: 'lumberjackLeft',
      newIndex: 1,
      boundaryCondition: function(lumberjackIndex) {
        if(lumberjackIndex % gridWidth !== 0) return true;
        else return false;
      }
    },
    right: {
      code: 68,
      animation: 'lumberjackRight',
      newIndex: 1,
      boundaryCondition: function(lumberjackIndex) {
        if(lumberjackIndex % gridWidth !== gridWidth-1) return true;
        else return false;
      }
    }
  };


  //hide pages for the introPage
  loadingPage.classList.add('hidden');
  gamePage.classList.add('hidden');
  gameOverPage.classList.add('hidden');
  instructions.classList.add('hidden');
  // screen.classList.add('hidden');
  // newGameBtn.classList.add('hidden');
  // instructionsBtn.classList.add('hidden');


  // startTV.addEventListener('click',function(){
  //   screen.classList.remove('hidden');
  //   screen.img.classList.add('screenFadeInOut');
  //
  // });

  // //Event listeners
  instructionsBtn.addEventListener('click', function(){
    instructions.classList.remove('hidden');
  });

  newGameBtn.addEventListener('click',function (){
    introPage.classList.add('hidden');
    loadingPage.classList.remove('hidden');
  });

  loadGame.addEventListener('click',function(){
    loadingPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    createGrid();
    startedGame =true;
    score = 0;
  });

  restartBtn.addEventListener('click',function (){
    location.reload();
  });



  //timers messageboards and scores
  $scoreboard.text('Score:'+ score);


  //LIBRARY
  const trees = [7,8,9,20,21,22,34,38,44,48,54,61,67,71,77,81,87];

  // CREATES GRID
  //Rendering static tilemaps done with a nested loop iterating over columns and rows.
  function createGrid(){
    for (let i=0; i<gridSize; i++) {
      const div = document.createElement('div');
      grid.appendChild(div);
      // Push elements to previously empty cells array
      cells.push(div);
    }
    createLife();
    generateTrees();
  }
  createGrid();

  function createLife(){
    lifebar;
    for(let i=0; i<3; i++){
      const life = document.createElement('img');
      life.src ='./images/heart.png';
      lifebar.appendChild(life);
    }
  }

  //add lumberjackIndex to grid
  cells[lumberjackIndex].classList.add('lumberjack');

  //add bear to grid
  cells[bearIndex].classList.add('bear');


  let tick = 360;
  const countdown = setInterval(() =>{
    tick --;
    timer.innerHTML = tick;
    if (tick <= 0) {
      clearInterval(countdown);
      loseGame();
    }
  }, 1000);

  // function addLife(){
  //   numOfLives++;
  //   const life = document.createElement('img');
  //   life.src ='./images/heart.png';
  //   lifebar.appendChild(life);
  // }

  function generateTrees(){
    for (let i=0; i<trees.length; i++) {
      cells[trees[i]].classList.add('tree');
    }
  }

  //LOSE THE GAMEs
  function loseGame(){
    cells =[];
    grid.innerHTML ='';
    gamePage.classList.add('hidden');
    gameOverPage.classList.remove('hidden');
    //clears the board
  }


  //checks if cell has bear
  function checkBear() {
    if(lumberjackIndex === bearIndex){
      score--;
      numOfLives --;
      lumberjackState =2;
      bearState =2;
      actionCell = cells[lumberjackIndex];
      className = 'lumberjackHurt';
      if(lifebar.lastChild){
        lifebar.removeChild(lifebar.lastChild);
      }else {
        lumberjackState = 3; // dead!
        loseGame();
      }
    }
  }

  //BEAR'S STATE
  window.setInterval(function() {
    switch(bearState) {
      case 0: //normal
        if(actionCell) actionCell.classList.remove('bearAttack', 'bearHurt');
        actionCell = cells[bearIndex];
        bearClassName = 'bear';
        break;
      case 1: // if attacking
        if(actionCell) actionCell.classList.remove('bearAttack');
        actionCell = cells[bearIndex];
        bearClassName = 'bearAttack';
        break;
      case 2: //if hurt
        if(actionCell) actionCell.classList.remove('bearHurt');
        actionCell = cells[bearIndex];
        bearClassName = 'bearHurt';
        score ++;
        break;
    }
    // show the bear in the right place
    if(cells[bearIndex])
      cells[bearIndex].classList.add(bearClassName);
  }, 50);



  //LUMBERJACK STATE
  window.setInterval(function() {
    switch(lumberjackState) {
      case 0: //normal
        if(actionCell) actionCell.classList.remove('lumberjackLeft','lumberjackRight','lumberjackAttack', 'lumberjackHurt');
        className = 'lumberjack';
        break;
      case 1: // if attacking
        if(actionCell) actionCell.classList.remove('lumberjackAttack', 'lumberjackLeft', 'lumberjackRight');
        actionCell = cells[lumberjackIndex];
        className = 'lumberjackAttack';
        if (inventory > 0)inventory--;
        lumberjackState =0;
        break;
      case 2: //if hurt
        if(actionCell) actionCell.classList.remove('lumberjackHurt');
        actionCell = cells[lumberjackIndex];
        className = 'lumberjackHurt';
        score --;
        numOfLives --;
        lumberjackState =0;
        break;
      case 3:
      //dead!
        loseGame();
    }
    // show the lumberjack in the right place
    if(cells[lumberjackIndex])
      cells[lumberjackIndex].classList.add(className);
  }, 50);

  //ARROW BINDING
  document.addEventListener('keyup', () => {
    lumberjackState = 0;
  });
  document.addEventListener('keydown', (e) => {
    const code = e.keyCode;
    const direction = directionCodes[code];
    function nextCell(a, b, direction) {
      return direction === 'up' || direction === 'left' ? a - b : a + b;
    }
    //picking up pinecone and respawn
    if (cells[lumberjackIndex].classList.contains('pinecone')){
      cells[lumberjackIndex].classList.remove('pinecone');
      spawnItems();
      if (inventory < 10){
        inventory ++;
        console.log('pinecone added to inventory');
        console.log(inventory);
      }
    }

    playerMovement(direction);

    //PLAYER MOVEMENTS
    function playerMovement(direction) {

      const blah = nextCell(lumberjackIndex, lumberJackDirections[direction].newIndex, direction);
      if(lumberJackDirections[direction].boundaryCondition(lumberjackIndex) && !cells[blah].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack', 'lumberjackAttack', 'lumberjackRight', 'lumberjackLeft');
        lumberjackIndex = blah;
        cells[lumberjackIndex].classList.add(lumberJackDirections[direction].animation);
        setTimeout(function() {
          cells[lumberjackIndex].classList.remove(lumberJackDirections[direction].animation);
        }, 200);
      }
    }
    checkBear();

    // PINECONE FIRING
    if(code === 76){//right attack
      lumberjackState = 1; // attacking!
      if (bearIndex === lumberjackIndex +1 || bearIndex === lumberjackIndex + 2){
        bearState =2;
        score++;
        console.log('pinecone!', inventory, score);
      }
    }
    if(code === 74){//left attack
      lumberjackState = 1; // attacking!
      if (bearIndex === lumberjackIndex - 1 || bearIndex === lumberjackIndex - 2){
        bearState =2;
        score++;
        console.log('pinecone!', inventory, score);
      }
    }
    if(code === 75){//down attack
      lumberjackState = 1; // attacking!
      if (bearIndex === lumberjackIndex + gridWidth || bearIndex === lumberjackIndex +(gridWidth* 2)){
        bearState =2;
        score++;
        console.log('pinecone!', inventory, score);
      }
    }
    if(code === 73){ //up attack
      lumberjackState = 1; // attacking!
      if (bearIndex === lumberjackIndex - gridWidth || bearIndex === lumberjackIndex -(gridWidth* 2)){
        bearState =2;
        score++;
        console.log('pinecone!', inventory, score);
      }
    }
  }, false);

  //SPAWN RANDOM ITEMS
  function spawnItems(){
    window.setTimeout(() => {
      pineconeIndex = Math.floor(Math.random() * (gridHeight*gridWidth));
      while(trees.includes(pineconeIndex) || pineconeIndex === bearIndex){
        pineconeIndex = Math.floor(Math.random() * (gridHeight*gridWidth));
      }
      cells[pineconeIndex].classList.add('pinecone');
    }, 1000);
  }
  spawnItems();


  // BEAR MOVEMENTS
  const bearPosition = ['up', 'down', 'left', 'right'];
  let direction = bearPosition[0];
  window.setInterval(() => {
    bearState =0;
    switch(direction) {
      case 'right':
        if(bearIndex % gridWidth !== gridWidth-1 && !cells[bearIndex+1].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear', 'bearHurt', 'bearAttack');
          bearIndex += 1;
          cells[bearIndex].classList.add('bear');
        } else {
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        checkBear();
        break;
      case 'left':
        if(bearIndex % gridWidth !== 0 && !cells[bearIndex-1].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear', 'bearAttack', 'bearHurt');
          bearIndex -= 1;
          cells[bearIndex].classList.add('bear');
        } else {
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        checkBear();
        break;
      case 'down':
        if(bearIndex < gridWidth*gridHeight-gridWidth && !cells[bearIndex+gridWidth].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear', 'bearAttack', 'bearHurt');
          bearIndex += gridWidth;
          cells[bearIndex].classList.add('bear');
        } else {
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        checkBear();
        break;
      case 'up':
        if(bearIndex > gridWidth-1 && !cells[bearIndex-gridWidth].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear', 'bearAttack', 'bearHurt');
          bearIndex -= gridWidth;
          cells[bearIndex].classList.add('bear');
        } else {
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        checkBear();
        break;
    }
  }, 1000);



  // function updatePosition(index, direction) {
  //   // depending on direction, change index
  //   switch (direction){
  //     case 'up':
  //       index - gridWidth;
  //       break;
  //     case 'down':
  //       index + gridWidth;
  //       break;
  //     case 'left':
  //       index -1;
  //       break;
  //     case 'right':
  //       index + 1;
  //       break;
  //   }
  //   return index;
  // }


});
