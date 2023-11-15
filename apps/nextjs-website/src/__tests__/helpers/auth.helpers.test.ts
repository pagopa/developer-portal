import { passwordMatcher } from '../../helpers/auth.helpers';

describe('passwordMatch', () => {
  it('returns true if the passwords match', () => {
    const validPasswords = ['Password1!', 'P4ssw0rd@!'];
    const invalidPasswords = [
      'password',
      'password1',
      'password!',
      'password1!',
      'Password',
      'Password1',
      'Password!',
    ];

    validPasswords.forEach((password) => {
      expect(passwordMatcher.test(password)).toBe(true);
    });

    invalidPasswords.forEach((password) => {
      expect(passwordMatcher.test(password)).toBe(false);
    });
  });
});
