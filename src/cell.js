(function(exports) {
  function Cell(type, isHabitable) {
    this._type = type;
    this._isHabitable = isHabitable;
  }

  Cell.prototype = {
    isHabitable() { return this._isHabitable; },
    type() { return this._type; },
  };

  exports.Cell = Cell;
})(this);
