import { generateIdFromString } from '@/helpers/anchor.helpers';

describe('generateIdFromString', () => {
  it('should return an empty string when id is undefined', () => {
    const result = generateIdFromString(undefined);
    expect(result).toBe('');
  });

  it('should trim, lowercase, and replace spaces with hyphens', () => {
    const result = generateIdFromString('  Test String ');
    expect(result).toBe('test-string');
  });

  it('should remove accents and special characters @#', () => {
    const result = generateIdFromString('Éxámplé String!@#!@#$%^&*()_+');
    expect(result).toBe('example-string!!$%^&*()_');
  });

  it('should not modify an already normalized string', () => {
    const result = generateIdFromString('simple-string');
    expect(result).toBe('simple-string');
  });

  it('should handle numbers correctly', () => {
    const result = generateIdFromString('12345 test');
    expect(result).toBe('12345-test');
  });

  it('should remove invalid characters but keep punctuation', () => {
    const result = generateIdFromString('This is valid?!');
    expect(result).toBe('this-is-valid?!');
  });

  it('should handle strings with multiple spaces', () => {
    const result = generateIdFromString('Test   multiple   spaces');
    expect(result).toBe('test-multiple-spaces');
  });

  it('should handle strings with only spaces', () => {
    const result = generateIdFromString('   ');
    expect(result).toBe('');
  });
});
