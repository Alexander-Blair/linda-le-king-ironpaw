(function(exports) {
  function PageNavigator(
    introPage,
    loadingPage,
    gamePage,
    gameOverPage,
    instructions,
  ) {
    this._introPage = introPage;
    this._loadingPage = loadingPage;
    this._gamePage = gamePage;
    this._gameOverPage = gameOverPage;
    this._instructions = instructions;
  }

  PageNavigator.prototype = {
    showIntroPage() {
      this._loadingPage.classList.add('hidden');
      this._gamePage.classList.add('hidden');
      this._gameOverPage.classList.add('hidden');
      this._instructions.classList.add('hidden');
    },
    showLoadingPage() {
      this._introPage.classList.add('hidden');
      this._loadingPage.classList.remove('hidden');
    },
    showInstructions() {
      this._instructions.classList.remove('hidden');
    },
    showGamePage() {
      this._loadingPage.classList.add('hidden');
      this._gamePage.classList.remove('hidden');
    },
  };

  exports.PageNavigator = PageNavigator;
})(this);

