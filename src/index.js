import { createStore } from 'redux';

import CharacterController from './game/characterController';
import Grid from './game/grid';
import GridRenderer from './renderers/gridRenderer';
import PageNavigator from './pageNavigator';
import generateGameConfig from './config/generateGameConfig';
import '../css/style.css';
import reducer from './redux/reducers';

document.addEventListener('DOMContentLoaded', () => {
  const pageNavigator = new PageNavigator(
    document.querySelector('#intro-images'),
    document.querySelector('#game-page'),
    document.querySelector('#game-over-page'),
    document.querySelector('#instructions'),
  );

  const store = createStore(reducer);

  function createGameClasses() {
    const gameConfig = generateGameConfig();
    const grid = new Grid(gameConfig, store);

    const gridRenderer = new GridRenderer(
      document.querySelector('#grid'),
      document.querySelector('#lifebar'),
      document.querySelector('#scoreboard'),
      store,
      gameConfig,
    );

    const characterController = new CharacterController(grid, document, window, pageNavigator);

    gridRenderer.init();
    characterController.setupLumberjackMovementListener();
    characterController.setupBearMovementInterval();
  }

  const newGameButton = document.querySelector('#new-game-button');
  const instructionsButton = document.querySelector('#instructions-button');
  const audio = document.querySelector('#intro-music');

  instructionsButton.addEventListener('click', () => pageNavigator.toggleInstructions());

  newGameButton.addEventListener('click', () => {
    if (pageNavigator.gameInProgress()) return;

    audio.play();
    createGameClasses();
    pageNavigator.showGamePage();
  });
});
