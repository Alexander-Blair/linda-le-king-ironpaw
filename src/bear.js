(function(exports) {
  function Bear() {
    this._state = 'exploring';
  }

  Bear.prototype = {
    isExploring() { return this._state === 'exploring'; },
    isAttacking() { return this._state === 'attacking'; },
    isHurt() { return this._state === 'hurt'; },
    setExploring() { this._state = 'exploring'; },
    setAttacking() { this._state = 'attacking'; },
    setHurt() { this._state = 'hurt'; },
  };

  exports.Bear = Bear;
})(this);
