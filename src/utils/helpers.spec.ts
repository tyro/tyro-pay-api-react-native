import { Platform } from 'react-native';
import { ANDROID_USER_AGENT_STRING, IOS_USER_AGENT_STRING, getUserAgent, isAndroid, isiOS } from './helpers';

describe('helpers', () => {
  describe('OS = Android', () => {
    const fakePlatform = {
      OS: 'android',
    } as Platform;

    it('isAndroid should return true', () => {
      expect(isAndroid(fakePlatform.OS)).toBe(true);
    });

    it('isiOS should return false', () => {
      expect(isiOS(fakePlatform.OS)).toBe(false);
    });
  });

  describe('OS = iOS', () => {
    const fakePlatform = {
      OS: 'ios',
    } as Platform;

    it('isAndroid should return false', () => {
      expect(isAndroid(fakePlatform.OS)).toBe(false);
    });

    it('isiOS should return true', () => {
      expect(isiOS(fakePlatform.OS)).toBe(true);
    });
  });

  describe('getUserAgent', () => {
    it('Gets the iOS user agent', () => {
      const fakePlatform = {
        OS: 'ios',
      } as Platform;
      const userAgent = getUserAgent(fakePlatform.OS);
      expect(userAgent).toBe(IOS_USER_AGENT_STRING);
    });

    it('Gets the android user agent', () => {
      const fakePlatform = {
        OS: 'android',
      } as Platform;
      const userAgent = getUserAgent(fakePlatform.OS);
      expect(userAgent).toBe(ANDROID_USER_AGENT_STRING);
    });
  });
});
