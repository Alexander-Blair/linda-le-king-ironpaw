document.addEventListener('DOMContentLoaded', () => {
  // To do list
  //instructions button
  //timer?
  //turn into smooth based tile game?
  //add score
  //add logic
  //pinecone and lumberjack - set inline two backgrounds at once. set seperate class for pinecone and lumberjack
  //set lumberjack state
  //create class for pinecone thrown vs pincone
  //check for collision between pinecone and bear


  //GLOBAL VARIABLES


  //Map variables
  const gridHeight = 10;
  const gridWidth = 10;
  const gridSize = gridHeight * gridWidth;
  let cells = [];

  // Dom variables
  const grid = document.querySelector('#grid');
  const timer = document.querySelector('#timer');
  const messageBox = document.querySelector('.messageBox');


  //intro page
  // const newGame = document.querySelector('#newGame');
  // const introScreen = document.querySelector('.introScreen');
  // const endScreen = document.querySelector('.endScreen');
  // const restartBtn = document.querySelector('.restartBtn');
  // const soundBtn = document.querySelector('.soundBtn');
  //make these
  // const p2life = document.querySelector('#lifebar');
  // const instructionsBtn = document.querySelector('.instructionsBtn')
  // const messageDisplay = document.querySelector('.message');//make display
  let className = 'lumberjack';
  let bearClassName = 'bear';
  let lumberjackIndex = 0;
  let bearIndex = 99;
  let pineconeIndex = null;
  let inventory = 5;
  let score = 10;
  let numOfLives = 3;
  let lifebar;
  let lumberjackState = 0;
  let bearState =0;
  let actionCell;



  // //Event listeners
  // newGame.addEventListener('click',function (){
  //   alert('hello');
  // });
  //
  // restartBtn.addEventListener('click',function (){
  //   alert('hello, again!');
  // });



  //LIBRARY
  const trees = [7,8,9,20,21,22,34,38,44,48,54,61,67,71,77,81,87];

  //Gameplay Variables
  // const moveKeys ={
  //   right: 1,
  //   left: -1,
  //   down: gridHeight,
  //   up: -gridHeight
  // };

  // CREATES GRID
  //Rendering static tilemaps done with a nested loop iterating over columns and rows.
  function startGame(){
    for (let i=0; i<gridSize; i++) {
      const div = document.createElement('div');
      grid.appendChild(div);
      // Push elements to previously empty cells array
      cells.push(div);
    }
  }
  startGame();

  function init(){
    lifebar = document.querySelector('#lifebar');
    for(let i=0; i<3; i++) addLife();
    // grid.appendChild(Instructions)
  }
  init();

  //add lumberjackIndex to grid
  cells[lumberjackIndex].classList.add('lumberjack');

  //add bear to grid
  cells[bearIndex].classList.add('bear');


  let tick = 60;
  //CHANGE WHEN DEMONSTRATING
  const countdown = setInterval(() =>{
    tick --;
    timer.innerHTML = tick;
    if (tick <= 0) return clearInterval(countdown);
  }, 1000);
  //run every 1 second

  function addLife(){
    numOfLives++;
    const life = document.createElement('img');
    life.src ='./images/heart.png';
    lifebar.appendChild(life);
  }

  function generateTrees(){
    for (let i=0; i<trees.length; i++) {
      cells[trees[i]].classList.add('tree');
    }
  }
  generateTrees();

  //LOSE THE GAME
  function loseGame(){
    cells =[];
    grid.innerHTML ='';
  }


  //checks if cell has bear
  function checkBear() {
    if(lumberjackIndex === bearIndex){
      score--;
      numOfLives --;
      lumberjackState =2;

      if(lifebar.lastChild) lifebar.removeChild(lifebar.lastChild);
      else lumberjackState = 3; // dead!
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
        if(actionCell) actionCell.classList.remove('lumberjackAttack', 'lumberjackHurt');
        className = 'lumberjack';
        break;
      case 1: // if attacking
        if(actionCell) actionCell.classList.remove('lumberjackAttack');
        actionCell = cells[lumberjackIndex];
        className = 'lumberjackAttack';
        if (inventory > 0)inventory--;
        break;
      case 2: //if hurt
        if(actionCell) actionCell.classList.remove('lumberjackHurt');
        actionCell = cells[lumberjackIndex];
        className = 'lumberjackHurt';
        score --;
        numOfLives --;
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
  document.addEventListener('keyup', (e) => {
    lumberjackState = 0;
  });
  document.addEventListener('keydown', (e) => {
    const code =e.keyCode;

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
    //PLAYER MOVEMENTS
    if (code === 65){
      //left
      if(lumberjackIndex % gridWidth !== 0 && !cells[lumberjackIndex-1].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex -= 1;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
      checkBear();
    }
    if (code === 68 ){
      //right
      if(lumberjackIndex % gridWidth !== gridWidth-1 && !cells[lumberjackIndex+1].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex += 1;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
      checkBear();
    }
    if (code === 83) {
      //down
      if (!(lumberjackIndex > (gridWidth * gridHeight) - gridWidth) && cells[lumberjackIndex+gridWidth] && !cells[lumberjackIndex+gridWidth].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex += gridWidth;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
      checkBear();
    }
    if (code === 87) {
      //up
      if (lumberjackIndex > gridWidth-1 && !cells[lumberjackIndex-gridWidth].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex -= gridWidth;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
      checkBear();
    }

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
