import {
  validateEmail,
  validateMaxLenght,
  validateNameFormat,
  validateRequired,
  validatePassword,
} from '../../helpers/auth.helpers';

describe('validateRequired', () => {
  it('returns error if the value is empty', () => {
    expect(validateRequired('')).toBe('requiredFieldError');
  });

  it('returns null if the value is not empty', () => {
    expect(validateRequired('test')).toBe(null);
  });
});

describe('validateMaxLenght', () => {
  it('returns error if the trimmed value exceeds the max length', () => {
    expect(validateMaxLenght(` ${'a'.repeat(101)} `)).toBe(
      'maxLengthFieldError'
    );
  });

  it('returns null if the trimmed value is within the max length', () => {
    expect(validateMaxLenght(` ${'a'.repeat(100)} `)).toBe(null);
  });
});

describe('validateNameFormat', () => {
  it('returns error if the name contains unsupported characters', () => {
    expect(validateNameFormat('John@Doe')).toBe('nameFieldError');
  });

  it('returns null if the name uses supported separators', () => {
    expect(validateNameFormat(" John Doe-O'Neil ")).toBe(null);
  });

  it('returns null if the name contains accented and extended latin letters', () => {
    expect(validateNameFormat('José María')).toBe(null);
    expect(validateNameFormat('Dvořák')).toBe(null);
    expect(validateNameFormat('Guðmundsdóttir')).toBe(null);
    expect(validateNameFormat('Łukasz 2')).toBe(null);
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
