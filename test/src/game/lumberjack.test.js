import { Lumberjack, maxPineCones } from '../../../src/game/lumberjack';

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

  describe('picking up and throwing pinecones', () => {
    let lumberjack;

    beforeEach(() => {
      lumberjack = new Lumberjack(1);
    });

    it('starts with no pinecones', () => {
      expect(lumberjack.numberOfPinecones()).toEqual(0);
      expect(lumberjack.canThrowPineCone()).toBe(false);
    });

    it('cannot throw a pinecone when there are none', () => {
      lumberjack.throwPineCone();

      expect(lumberjack.numberOfPinecones()).toEqual(0);
    });

    it('can throw a pinecone as soon as one is picked up', () => {
      lumberjack.pickUpPineCone();

      expect(lumberjack.numberOfPinecones()).toEqual(1);
      expect(lumberjack.canThrowPineCone()).toBe(true);
    });

    it('cannot pick up any more pinecones after limit is reached', () => {
      for (let i = 0; i < maxPineCones; i += 1) {
        expect(lumberjack.canPickUpPineCone()).toBe(true);
        lumberjack.pickUpPineCone();
      }

      expect(lumberjack.canPickUpPineCone()).toBe(false);
    });
  });
});
