import { initialize } from '../index';
import Localiser from '../Localiser';

describe('Localiser', () => {
  describe('initialize()', () => {
    let localiser: Localiser;

    it('should return new instance of LocaliserInstance class', () => {
      localiser = initialize({
        localeResources: {},
        fallbackLocale: 'ru',
      });

      expect(localiser).toBeInstanceOf(Localiser);
    });
  });
});
