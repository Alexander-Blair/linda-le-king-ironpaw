export const BEAR_ATTACK_LUMBERJACK = 'BEAR_ATTACK_LUMBERJACK';
export const MOVE_BEAR = 'MOVE_BEAR';
export const MOVE_LUMBERJACK = 'MOVE_LUMBERJACK';
export const PICK_UP_PINECONE = 'PICK_UP_PINECONE';
export const SPAWN_BEAR = 'SPAWN_BEAR';
export const SPAWN_LUMBERJACK = 'SPAWN_LUMBERJACK';
export const SPAWN_PINECONE = 'SPAWN_PINECONE';
export const UPDATE_BEAR_STATUS = 'UPDATE_BEAR_STATUS';
export const UPDATE_LUMBERJACK_STATUS = 'UPDATE_LUMBERJACK_STATUS';

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
    gridWidth,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function moveLumberjack(xCoordinate, yCoordinate, gridWidth, direction) {
  return {
    type: MOVE_LUMBERJACK,
    xCoordinate,
    yCoordinate,
    gridWidth,
    direction,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function pickUpPinecone() {
  return { type: PICK_UP_PINECONE };
}

export function spawnBear(xCoordinate, yCoordinate, status, gridWidth) {
  return {
    type: SPAWN_BEAR,
    xCoordinate,
    yCoordinate,
    status,
    gridWidth,
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
    gridWidth,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function spawnPinecone(xCoordinate, yCoordinate, gridWidth) {
  return {
    type: SPAWN_PINECONE,
    xCoordinate,
    yCoordinate,
    gridWidth,
    index: positionToIndex(xCoordinate, yCoordinate, gridWidth),
  };
}

export function updateBearStatus(status) {
  return { type: UPDATE_BEAR_STATUS, status };
}

export function updateLumberjackStatus(status) {
  return { type: UPDATE_LUMBERJACK_STATUS, status };
}
