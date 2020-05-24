export const BEAR_ATTACK_LUMBERJACK = 'BEAR_ATTACK_LUMBERJACK';
export const MOVE_BEAR = 'MOVE_BEAR';
export const MOVE_FIRED_PINECONE = 'MOVE_FIRED_PINECONE';
export const MOVE_LUMBERJACK = 'MOVE_LUMBERJACK';
export const PICK_UP_AVAILABLE_PINECONE = 'PICK_UP_AVAILABLE_PINECONE';
export const REMOVE_FIRED_PINECONE = 'REMOVE_FIRED_PINECONE';
export const SPAWN_BEAR = 'SPAWN_BEAR';
export const SPAWN_LUMBERJACK = 'SPAWN_LUMBERJACK';
export const SPAWN_AVAILABLE_PINECONE = 'SPAWN_AVAILABLE_PINECONE';
export const THROW_PINECONE = 'THROW_PINECONE';
export const UPDATE_BEAR_STATUS = 'UPDATE_BEAR_STATUS';
export const UPDATE_LUMBERJACK_STATUS = 'UPDATE_LUMBERJACK_STATUS';
export const UPDATE_ROUND_NUMBER = 'UPDATE_ROUND_NUMBER';
export const UPDATE_SCORE = 'UPDATE_SCORE';

function positionToIndex(xCoordinate, yCoordinate, gridWidth) {
  if (xCoordinate === undefined || yCoordinate === undefined) return undefined;

  return xCoordinate + yCoordinate * gridWidth;
}

export function bearAttackLumberjack(numberOfLives) {
  return { type: BEAR_ATTACK_LUMBERJACK, numberOfLives };
}

export function moveBear(xCoordinate, yCoordinate, gridWidth) {
  return {
    type: MOVE_BEAR,
    xCoordinate,
    yCoordinate,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function moveFiredPinecone(xCoordinate, yCoordinate, gridWidth) {
  return {
    type: MOVE_FIRED_PINECONE,
    xCoordinate,
    yCoordinate,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function moveLumberjack(xCoordinate, yCoordinate, gridWidth, direction) {
  return {
    type: MOVE_LUMBERJACK,
    xCoordinate,
    yCoordinate,
    direction,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function pickUpAvailablePinecone() {
  return { type: PICK_UP_AVAILABLE_PINECONE };
}

export function removeFiredPinecone() {
  return { type: REMOVE_FIRED_PINECONE };
}

export function spawnAvailablePinecone(xCoordinate, yCoordinate, gridWidth) {
  return {
    type: SPAWN_AVAILABLE_PINECONE,
    xCoordinate,
    yCoordinate,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function spawnBear(xCoordinate, yCoordinate, status, gridWidth) {
  return {
    type: SPAWN_BEAR,
    xCoordinate,
    yCoordinate,
    status,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function spawnLumberjack(xCoordinate, yCoordinate, numberOfLives, status, gridWidth) {
  return {
    type: SPAWN_LUMBERJACK,
    xCoordinate,
    yCoordinate,
    numberOfLives,
    status,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function throwPinecone(xCoordinate, yCoordinate, direction, gridWidth) {
  return {
    type: THROW_PINECONE,
    xCoordinate,
    yCoordinate,
    direction,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function updateBearStatus(status) {
  return { type: UPDATE_BEAR_STATUS, status };
}

export function updateLumberjackStatus(status) {
  return { type: UPDATE_LUMBERJACK_STATUS, status };
}

export function updateRoundNumber(roundNumber) {
  return { type: UPDATE_ROUND_NUMBER, roundNumber };
}

export function updateScore(score) {
  return { type: UPDATE_SCORE, score };
}
