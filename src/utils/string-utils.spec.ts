import { removeSpaces } from './string-utils';
describe('string-utils', () => {
  describe('removeSpaces()', () => {
    it('should remove spaces', () => {
      expect(removeSpaces(' i     am so .   cool ')).toBe('iamso.cool');
      expect(removeSpaces('1 2        3')).toBe('123');
    });
    it('should return empty string', () => {
      expect(removeSpaces(undefined)).toBe('');
      expect(removeSpaces('    ')).toBe('');
    });
  });
});
