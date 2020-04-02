import CharacterController from './characterController';
import Grid from './grid';
import GridRenderer from './gridRenderer';
import PageNavigator from './pageNavigator';

document.addEventListener('DOMContentLoaded', () => {
  const pageNavigator = new PageNavigator(
    document.querySelector('.introPage'),
    document.querySelector('.gamePage'),
    document.querySelector('.gameOverPage'),
    document.querySelector('.instructions'),
  );

  const gridWidth = 10;
  const gridHeight = 10;
  const numberOfLives = 3;
  const grid = new Grid(gridWidth, gridHeight, numberOfLives);

  const gridRenderer = new GridRenderer(
    grid,
    document.querySelector('#grid'),
    document.querySelector('#lifebar'),
    document.querySelector('#scoreboard'),
    window,
  );

  const characterController = new CharacterController(
    grid,
    gridRenderer,
    document,
    window,
    pageNavigator,
  );

  const newGameButton = document.querySelector('#newGameBtn');
  const instructionsButton = document.querySelector('#instructionsBtn');
  const restartButton = document.querySelector('.restartBtn');
  const audio = document.querySelector('#introMusic');

  instructionsButton.addEventListener('click', () => pageNavigator.showInstructions());
  restartButton.addEventListener('click', () => window.location.reload());
  newGameButton.addEventListener('click', () => {
    audio.play();
    pageNavigator.showGamePage();
    gridRenderer.init();
    characterController.setupLumberjackMovementListener();
    characterController.setupBearMovementInterval();
  });
});
