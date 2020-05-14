import { createStore } from 'redux';

import CharacterController from './game/characterController';
import Grid from './game/grid';
import GridPosition from './game/gridPosition';
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

  function createGameClasses() {
    const store = createStore(reducer);
    const gameConfig = generateGameConfig();
    const lumberjackGridPosition = new GridPosition(
      gameConfig.lumberjackStartingPosition,
      gameConfig.gridWidth,
      gameConfig.gridHeight,
      gameConfig.treePositions,
    );
    const bearGridPosition = new GridPosition(
      gameConfig.bearStartingPosition,
      gameConfig.gridWidth,
      gameConfig.gridHeight,
      gameConfig.treePositions,
    );
    const grid = new Grid(gameConfig, store, lumberjackGridPosition, bearGridPosition);

    const gridRenderer = new GridRenderer(
      document.querySelector('#grid'),
      document.querySelector('#lifebar'),
      document.querySelector('#scoreboard'),
      store,
      gameConfig,
    );

    gridRenderer.init();
    new CharacterController(grid, document, window, pageNavigator).startGame();
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
