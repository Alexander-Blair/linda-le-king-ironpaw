import CharacterController from './characterController';
import Grid from './grid';
import GridRenderer from './gridRenderer';
import PageNavigator from './pageNavigator';
import generateGameConfig from './generateGameConfig';
import '../css/style.css';

document.addEventListener('DOMContentLoaded', () => {
  const pageNavigator = new PageNavigator(
    document.querySelector('#intro-images'),
    document.querySelector('#game-page'),
    document.querySelector('#game-over-page'),
    document.querySelector('#instructions'),
  );

  function createGameClasses() {
    const gameConfig = generateGameConfig();
    const grid = new Grid(gameConfig);

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

    grid.spawnPinecone();
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
