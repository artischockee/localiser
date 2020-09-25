import { initialize } from '../index';
import LocaliserInstance from '../LocaliserInstance';

describe('Localiser', () => {
  describe('initialize()', () => {
    let localiser: LocaliserInstance;

    it('should return new instance of LocaliserInstance class', () => {
      localiser = initialize({
        localeResources: {},
        fallbackLocale: 'ru',
      });

      expect(localiser).toBeInstanceOf(LocaliserInstance);
    });
  });
});
