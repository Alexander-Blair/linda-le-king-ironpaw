export const maxPineCones = 10;

export function Lumberjack(numberOfLives) {
  this._numberOfLives = numberOfLives;
  this._numberOfPineCones = 0;
}

Lumberjack.prototype = {
  numberOfLives() { return this._numberOfLives; },
  loseLife() { this._numberOfLives -= 1; },
  isDead() { return this._numberOfLives <= 0; },
  numberOfPinecones() { return this._numberOfPineCones; },
  pickUpPineCone() { this._numberOfPineCones += 1; },
  canThrowPineCone() { return this._numberOfPineCones > 0; },
  canPickUpPineCone() { return this._numberOfPineCones < maxPineCones; },
  throwPineCone() { if (this.canThrowPineCone()) this._numberOfPineCones -= 1; },
};
