window.addEventListener('DOMContentLoaded', () => {
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
  const cells = [];

  // Dom variables
  const grid = document.querySelector('#grid');
  const timerDisplay = document.querySelector('.timerDisplay')
  const messageBox = document.querySelector('.messageBox');


  //intro page
  const newGame = document.querySelector('#newGame');
  const startPage = document.querySelector('.intro-page');
  const gameOver = document.querySelector('game-over');
  const restart = document.querySelector('.restartBtn')
  const timer = document.querySelector('#timer')
  //make these
  // const p2life = document.querySelector('#lifebar');
  // const instructionsBtn = document.querySelector('.instructionsBtn')
  // const messageDisplay = document.querySelector('.message');//make display
  let className = 'lumberjack';
  let lumberjackIndex = 0;
  let bearIndex = 99;
  let pineconeIndex = null;
  let inventory = 5;
  let score = 10;
  let numOfLives =3;
  let lifebar;
  let lumberjackState = 0;
  let actionCell;
  let pineconeBtn = false;




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
    for (let i=0; i<gridHeight*gridWidth; i++) {
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


  let tick = 60;

const countdown = setInterval(() =>{
    tick --;
    timer.innerHTML = tick;
    if (countdown < 1){
      clearInterval(countdown);
    }
  }, 1000);
    //run every 1 second

  function addLife(){
    numOfLives++;
    const life = document.createElement('img');
    life.src ='./images/heart.png';
    lifebar.appendChild(life);
  }

  //add lumberjackIndex to grid
  cells[lumberjackIndex].classList.add('lumberjack');

  //add bear to grid
  cells[bearIndex].classList.add('bear');


  function generateTrees(){
    for (let i=0; i<trees.length; i++) {
      cells[trees[i]].classList.add('tree');
    }
  }
  generateTrees();

  function checkBear() {
    if(lumberjackIndex === bearIndex){
      score--;
      numOfLives --;
      const lifebar = document.querySelector('#lifebar');
      if(lifebar.lastChild) lifebar.removeChild(lifebar.lastChild);
      else lumberjackState = 3; // dead!
      actionCell = cells[lumberjackIndex];
      actionCell.classList.add('lumberjackAttack');
    } else {
    }
  }


  if(numOfLives < 1){
    console.log('You dead');
    // loseGame(); //write this function!
  }

  window.setInterval(function() {
    switch(lumberjackState) {
      case 0: //normal
        if(actionCell) actionCell.classList.remove('lumberjackAttack');
        className = 'lumberjack';
        break;
      case 1: // if attacking
        if(actionCell) actionCell.classList.remove('lumberjackAttack');
        actionCell = cells[lumberjackIndex];
        className = 'lumberjackAttack';
        break;
      case 2: //if hurt
        actionCell = cells[lumberjackIndex];
        className = 'lumberjackHurt';
        score --;
        numOfLives --;
        break;
      case 3:
        console.log('dead!!!');
        //lose game function goes here
    }
    // show the lumberjack in the right place
    cells[lumberjackIndex].classList.add(className);
  }, 50);

  //ARROW BINDING
  window.addEventListener('keyup', (e) => {
    lumberjackState = 0;
    pineconeBtn = false;
  });
  window.addEventListener('keydown', (e) => {

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
    if (e.keyCode === 65) {
      console.log('left');
      if(lumberjackIndex%gridWidth !== 0 && !cells[lumberjackIndex-1].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex -= 1;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
      checkBear();
    }
    if (e.keyCode === 68 ){
      console.log('right');
      if(lumberjackIndex%gridWidth !== gridWidth-1 && !cells[lumberjackIndex+1].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex += 1;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
      checkBear();
    }
    if (e.keyCode === 83) {
      console.log('down');
      if (!(lumberjackIndex > (gridWidth * gridHeight) - gridWidth) && !cells[lumberjackIndex+gridWidth].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex += gridWidth;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
      checkBear();
    }
    if (e.keyCode === 87) {
      console.log('up');
      if (lumberjackIndex > gridWidth-1 && !cells[lumberjackIndex-gridWidth].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex -= gridWidth;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
      checkBear();
    }

    if(e.keyCode === 80 || e.keyCode === 16){
      // p = 80
      // shift = 16
      pineconeBtn = true;


      // console.log('p is for pinecone!');
      // lumberjackState = 1; // attacking!
      // if (inventory > 0){
      //   inventory--;
      //   console.log(inventory);
    }
  }, false);

  //SPAWN RANDOM ITEMS
  function spawnItems(){
    window.setTimeout(() => {
      pineconeIndex = Math.floor(Math.random() * (gridHeight*gridWidth));
      while(trees.includes(pineconeIndex)){
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
    switch(direction) {
      case 'right':
        if(bearIndex%gridWidth !== gridWidth-1 && !cells[bearIndex+1].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear');
          bearIndex += 1;
          cells[bearIndex].classList.add('bear');
        } else {
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        checkBear();
        break;
      case 'left':
        if(bearIndex%gridWidth !== 0 && !cells[bearIndex-1].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear');
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
          cells[bearIndex].classList.remove('bear');
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
          cells[bearIndex].classList.remove('bear');
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
});
