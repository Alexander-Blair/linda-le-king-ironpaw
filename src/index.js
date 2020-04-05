import CharacterController from './characterController';
import Grid from './grid';
import GridRenderer from './gridRenderer';
import PageNavigator from './pageNavigator';
import '../css/style.css';

document.addEventListener('DOMContentLoaded', () => {
  const pageNavigator = new PageNavigator(
    document.querySelector('#intro-images'),
    document.querySelector('#game-page'),
    document.querySelector('#game-over-page'),
    document.querySelector('#instructions'),
  );

  function createGameClasses() {
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

    gridRenderer.init();
    characterController.setupLumberjackMovementListener();
    characterController.setupBearMovementInterval();
  }

  const newGameButton = document.querySelector('#new-game-button');
  const instructionsButton = document.querySelector('#instructions-button');
  const restartButton = document.querySelector('#restart-button');
  const audio = document.querySelector('#intro-music');

  instructionsButton.addEventListener('click', () => pageNavigator.toggleInstructions());
  restartButton.addEventListener('click', () => {
    createGameClasses();
    pageNavigator.showGamePage();
  });
  newGameButton.addEventListener('click', () => {
    audio.play();
    createGameClasses();
    pageNavigator.showGamePage();
  });
});
