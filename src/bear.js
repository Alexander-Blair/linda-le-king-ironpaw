(function(exports) {
  function Bear(startingMovementInterval) {
    this._state = 'exploring';
    this._movementInterval = startingMovementInterval;
  }

  Bear.prototype = {
    setExploring() { this._state = 'exploring'; },
    setAttacking() { this._state = 'attacking'; },
    setHurt() { this._state = 'hurt'; },
    movementInterval() { return this._movementInterval; },
    state() { return this._state; },
  };

  exports.Bear = Bear;
})(this);
