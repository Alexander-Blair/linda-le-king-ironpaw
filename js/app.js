$(()=>{


  //VARIABLES

  const height = 10;
  const width = 10;
  const cells = [];
  const trees = [7,8,9,20,21,22,34,38,44,48,54,61,67,71,77,81,87];
  const grid = document.querySelector('#grid');
  // const $lumberjack= $('#lumberjack');
  // const $enemyBear = $('#enemyBear');
  let lumberjack = 0;
  let bear = 99;

  // 1. create grid

  function startGame(){
    for (let i=0; i<height*width; i++) {
      const div = document.createElement('div');
      grid.appendChild(div);
      // Push elements to previously empty cells array
      cells.push(div);
    }
  }

  startGame();

  //add lumberjack to grid
  cells[lumberjack].classList.add('lumberjack');

  //add bear to grid
  cells[bear].classList.add('bear');


  function generateTrees(){
    for (let i=0; i<trees.length; i++) {
      cells[trees[i]].classList.add('tree');
    }
  }
  generateTrees();

  //write function to check if it has a tree in the wall
  //refactor the below


  // MOVE YO LUMBER JACK
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) {
      console.log('left');
      if(lumberjack%width !== 0 && !cells[lumberjack-1].classList.contains('tree')){
        cells[lumberjack].classList.remove('lumberjack');
        lumberjack -= 1;
        cells[lumberjack].classList.add('lumberjack');
      }
    }
    if (e.keyCode === 39 ){
      console.log('right');
      if(lumberjack%width !== width-1 && !cells[lumberjack+1].classList.contains('tree')){
        cells[lumberjack].classList.remove('lumberjack');
        lumberjack += 1;
        cells[lumberjack].classList.add('lumberjack');
      }
    }
    if (e.keyCode === 40) {
      console.log('down');
      if (!(lumberjack > (width * height) - width) && !cells[lumberjack+width].classList.contains('tree')){
        cells[lumberjack].classList.remove('lumberjack');
        lumberjack += width;
        cells[lumberjack].classList.add('lumberjack');
      }
    }
    if (e.keyCode === 38) {
      console.log('up');
      if (lumberjack > width-1 && !cells[lumberjack-width].classList.contains('tree')){
        cells[lumberjack].classList.remove('lumberjack');
        lumberjack -= width;
        cells[lumberjack].classList.add('lumberjack');
      }
    }
  }, false);

});
