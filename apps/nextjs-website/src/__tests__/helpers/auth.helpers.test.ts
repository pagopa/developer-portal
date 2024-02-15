import {
  validateEmail,
  validateField,
  validatePassword,
} from '../../helpers/auth.helpers';

describe('validateField', () => {
  it('returns error if the value is empty', () => {
    expect(validateField('')).toBe('requiredFieldError');
  });

  it('returns null if the value is not empty', () => {
    expect(validateField('test')).toBe(null);
  });
});

describe('validateEmail', () => {
  it('returns error if the email is invalid', () => {
    expect(validateEmail('')).toBe('requiredFieldError');
    expect(validateEmail('test')).toBe('emailFieldError');
    expect(validateEmail('mail@example.com')).toBe(null);
  });
});

describe('validatePassword', () => {
  it('returns error if the password is invalid', () => {
    expect(validatePassword('')).toBe('requiredFieldError');
    expect(validatePassword('password')).toBe('passwordError');
    expect(validatePassword('Password1!')).toBe(null);
  });
});
