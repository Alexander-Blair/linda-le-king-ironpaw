(function(exports) {
  function Lumberjack(numberOfLives) {
    this._numberOfLives = numberOfLives;
    this._numberOfPineCones = 0;
    this._state = 'exploring';
  }

  const maxPineCones = 10;

  Lumberjack.prototype = {
    numberOfLives() { return this._numberOfLives; },
    loseLife() { this._numberOfLives -= 1; },
    isDead() { return this._numberOfLives === 0; },
    pickUpPineCone() { this._numberOfPineCones += 1; },
    canThrowPineCone() { return this._numberOfPineCones > 0; },
    canPickUpPineCone() { return this._numberOfPineCones <= maxPineCones; },
    throwPineCone() { this._numberOfPineCones -= 1; },
    setExploring() { this._state = 'exploring'; },
    setAttacking() { this._state = 'attacking'; },
    setHurt() { this._state = 'hurt'; },
    isHurt() { return this._state === 'hurt'; },
    isAttacking() { return this._state === 'attacking'; },
    isExploring() { return this._state === 'exploring'; },
  };

  exports.Lumberjack = Lumberjack;
})(this);
