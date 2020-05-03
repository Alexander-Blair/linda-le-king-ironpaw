export const bearExploring = 'exploring';
export const bearAttacking = 'attacking';
export const bearHurt = 'hurt';

export function Bear(startingMovementInterval) {
  this._state = bearExploring;
  this._movementInterval = startingMovementInterval;
}

Bear.prototype = {
  setExploring() { this._state = bearExploring; },
  setAttacking() { this._state = bearAttacking; },
  setHurt() { this._state = bearHurt; },
  movementInterval() { return this._movementInterval; },
  state() { return this._state; },
};
