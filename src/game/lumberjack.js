export default function Lumberjack(numberOfLives, maxPinecones) {
  this._numberOfLives = numberOfLives;
  this._numberOfPineCones = 0;
  this._maxPinecones = maxPinecones;
}

Lumberjack.prototype = {
  numberOfLives() { return this._numberOfLives; },
  loseLife() { this._numberOfLives -= 1; },
  isDead() { return this._numberOfLives <= 0; },
  numberOfPinecones() { return this._numberOfPineCones; },
  pickUpPineCone() { this._numberOfPineCones += 1; },
  canThrowPineCone() { return this._numberOfPineCones > 0; },
  canPickUpPineCone() { return this._numberOfPineCones < this._maxPinecones; },
  throwPineCone() { if (this.canThrowPineCone()) this._numberOfPineCones -= 1; },
  direction() { return this._direction; },
  updateDirection(direction) { this._direction = direction; },
};
