import { getAllMatchesByRegExp, getProcessedLocItem } from '../utils';

describe('Utils', () => {
  describe('getAllMatchesByRegExp()', () => {
    let regExp: RegExp;
    let string: string;
    let result: string[][];

    it('should return matches correctly', () => {
      regExp = /:([A-z]+)/g;
      string = '/profile/:competitionId';

      result = getAllMatchesByRegExp(regExp, string);

      expect(result).toStrictEqual([[':competitionId', 'competitionId']]);
    });

    it('should not result to a memory leak due to absence of "g" flag in RegExp', () => {
      regExp = /:([A-z]+)/;
      string = '/profile/:competitionId';

      result = getAllMatchesByRegExp(regExp, string);

      expect(result).toStrictEqual([[':competitionId', 'competitionId']]);
    });

    it('should return an empty array when there is no matches in the string', () => {
      regExp = /:([A-z]+)/;
      string = '/profile/no/matches/here';

      result = getAllMatchesByRegExp(regExp, string);

      expect(result).toStrictEqual([]);
    });

    it('should return every letter', () => {
      regExp = /(.)/;
      string = 'madness';

      result = getAllMatchesByRegExp(regExp, string);

      expect(result).toStrictEqual([
        ['m', 'm'],
        ['a', 'a'],
        ['d', 'd'],
        ['n', 'n'],
        ['e', 'e'],
        ['s', 's'],
        ['s', 's'],
      ]);
    });
  });

  describe('getProcessedLocItem()', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation((message) => message);
    });

    let result;

    it('should return empty string when no arguments provided', () => {
      result = getProcessedLocItem();

      expect(result).toBe('');
    });

    it('should return the same string provided in the 1st argument', () => {
      result = getProcessedLocItem('Test string');

      expect(result).toBe('Test string');
    });

    it('should return the same string provided in the 1st argument, even with word marked with "%"', () => {
      result = getProcessedLocItem('Test %string');

      expect(result).toBe('Test %string');
    });

    it('should return processed string from the string with word marked with "%"', () => {
      result = getProcessedLocItem('Test %string', { string: 'foobar' });

      expect(result).toBe('Test foobar');
    });

    it('should return the same string if invalid params (with non-existing keys) provided', () => {
      result = getProcessedLocItem('Test %string', { invalidString: 'foobar' });

      expect(result).toBe('Test %string');
    });
  });
});
