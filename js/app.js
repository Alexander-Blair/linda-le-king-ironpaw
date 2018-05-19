window.addEventListener('DOMContentLoaded', () => {
  // To do list
  //Enemy movement
  //spawn random items
  //instructions button
  //helth bar
  //timer
  //if (pineconeOrNot === false){

  //VARIABLES

  const gridHeight = 10;
  const gridWidth = 10;
  const cells = [];
  const trees = [7,8,9,20,21,22,34,38,44,48,54,61,67,71,77,81,87];
  const grid = document.querySelector('#grid');
  // const $lumberjackIndex= $('#lumberjackIndex');
  // const $enemyBear = $('#enemyBear');
  let lumberjackIndex = 0;
  let bearIndex = 99;
  // let items =[]
  let pineconeLocation = null;
  // let computerPlayer =false;

  // 1. create grid

  function startGame(){
    for (let i=0; i<gridHeight*gridWidth; i++) {
      const div = document.createElement('div');
      grid.appendChild(div);
      // Push elements to previously empty cells array
      cells.push(div);
    }
  }

  startGame();

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

  //ARROW BINDING
  window.addEventListener('keydown', (e) => {

    if (e.keyCode === 37) {
      console.log('left');
      if(lumberjackIndex%gridWidth !== 0 && !cells[lumberjackIndex-1].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex -= 1;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
    }
    if (e.keyCode === 39 ){
      console.log('right');
      if(lumberjackIndex%gridWidth !== gridWidth-1 && !cells[lumberjackIndex+1].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex += 1;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
    }
    if (e.keyCode === 40) {
      console.log('down');
      if (!(lumberjackIndex > (gridWidth * gridHeight) - gridWidth) && !cells[lumberjackIndex+gridWidth].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex += gridWidth;
        cells[lumberjackIndex].classList.add('lumberjack');
      }
    }
    if (e.keyCode === 38) {
      console.log('up');
      if (lumberjackIndex > gridWidth-1 && !cells[lumberjackIndex-gridWidth].classList.contains('tree')){
        cells[lumberjackIndex].classList.remove('lumberjack');
        lumberjackIndex -= gridWidth;
        cells[lumberjackIndex].classList.add('lumberjack');
      }

      // if (e.keyCode === 32){
      //   console.log('spacebar');
      //   if (items > 0){
      //     items--;
      //   }

      //   if(lumberjackIndex === bearIndex){
      //     console.log('collision!')
      //   }
    }
  }, false);

  //SPAWN RANDOM ITEMS

  // function spawnItems(item){
    //set timeout?
    pineconeLocation = Math.floor(Math.random() * (gridHeight*gridWidth));
    cells[pineconeLocation].classList.add('pinecone');
    //work out how not to get it in tree squares
    //convert to jquery with addClass later
  // }
  // spawnItems('pinecone');

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
          console.log(direction);
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        break;
      case 'left':
        if(bearIndex%gridWidth !== 0 && !cells[bearIndex-1].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear');
          bearIndex -= 1;
          cells[bearIndex].classList.add('bear');
        } else {
          console.log(direction);
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        break;
      case 'down':
        if(bearIndex < gridWidth*gridHeight-gridWidth && !cells[bearIndex+gridWidth].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear');
          bearIndex += gridWidth;
          cells[bearIndex].classList.add('bear');
        } else {
          console.log(direction);
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        break;
      case 'up':
        if(bearIndex > gridWidth-1 && !cells[bearIndex-gridWidth].classList.contains('tree')) {
          cells[bearIndex].classList.remove('bear');
          bearIndex -= gridWidth;
          cells[bearIndex].classList.add('bear');
        } else {
          console.log(direction);
          direction = bearPosition[Math.floor(Math.random() * bearPosition.length)];
          console.log(direction);
        }
        break;
    }
  }, 2000);



});
