export default function PageNavigator(
  introPage,
  gamePage,
  gameOverPage,
  instructions,
) {
  this._introPage = introPage;
  this._gamePage = gamePage;
  this._gameOverPage = gameOverPage;
  this._instructions = instructions;
}

PageNavigator.prototype = {
  toggleInstructions() {
    if (this._instructions.classList.contains('hidden')) {
      this._instructions.classList.remove('hidden');
    } else this._instructions.classList.add('hidden');
  },
  showGamePage() {
    this._instructions.classList.add('hidden');
    this._introPage.classList.add('hidden');
    this._gameOverPage.classList.add('hidden');
    this._gamePage.classList.remove('hidden');
  },
  showGameOverPage() {
    this._gamePage.classList.add('hidden');
    this._gameOverPage.classList.remove('hidden');
  },
};
