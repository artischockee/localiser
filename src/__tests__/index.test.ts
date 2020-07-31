import Localiser, { LocaliserInstance } from '../index';

describe('Localiser', () => {
  describe('init()', () => {
    let result: LocaliserInstance;

    it('should return new instance of LocaliserInstance class', () => {
      result = Localiser.init({}, 'ru');

      expect(result).toBeInstanceOf(LocaliserInstance);
    });
  });
});

describe('LocaliserInstance', () => {
  describe('with only "localeResources" argument provided', () => {
    let instance: LocaliserInstance;

    beforeAll(() => {
      const localeResources = {
        ru: {
          'a/b/c': 'фоо бар',
          'c/d/e': 'фоо %str',
          'e/f/g': '%param баз %extra',
        },
        en: {
          'a/b/c': 'foo bar',
          'c/d/e': 'foo %str',
          'e/f/g': '%param baz %extra',
        },
      };

      instance = new LocaliserInstance(localeResources, 'en');
    });

    describe('ls()', () => {
      let result: string | null;

      it('should return correct and processed string (without params)', () => {
        result = instance.ls('a/b/c', null, 'en');

        expect(result).toBe('foo bar');
      });

      it('should return correct and processed string (with 1 param)', () => {
        result = instance.ls('c/d/e', { str: 'testing' }, 'en');

        expect(result).toBe('foo testing');
      });

      it('should return correct and processed string (with 2+ params)', () => {
        result = instance.ls('e/f/g', { param: 'bass', extra: 'stonks' }, 'en');

        expect(result).toBe('bass baz stonks');
      });

      it('should return null if specified locale does not exist', () => {
        result = instance.ls('e/f/g', { param: 'bass', extra: 'stonks' }, 'stonks');

        expect(result).toBeNull();
      });

      it('should return null if specified locKey does not exist', () => {
        result = instance.ls('sto/nk/s', { param: 'bass', extra: 'stonks' }, 'ru');

        expect(result).toBeNull();
      });
    });
  });
});
