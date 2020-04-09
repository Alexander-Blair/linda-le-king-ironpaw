import Lumberjack from '../../src/lumberjack';

describe('Lumberjack', () => {
  describe('dying', () => {
    let lumberjack;
    const numberOfLives = 3;

    beforeEach(() => {
      lumberjack = new Lumberjack(numberOfLives);
    });

    it('starts out with the given number of lives', () => {
      expect(lumberjack.numberOfLives()).toEqual(numberOfLives);
      expect(lumberjack.isDead()).toBe(false);
    });

    it('is dead when lives reach zero', () => {
      for (let i = 0; i < numberOfLives; i += 1) {
        expect(lumberjack.isDead()).toBe(false);
        lumberjack.loseLife();
      }

      expect(lumberjack.isDead()).toBe(true);
    });
  });
});
