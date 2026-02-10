import { sanitizeFilename, SanitizeOptions } from '../src/utils/sanitizeFilename';

describe('sanitizeFilename', () => {
  it('replaces illegal characters', () => {
    expect(sanitizeFilename('file/name?with*illegal|chars.txt')).toBe('file_name_with_illegal_chars.txt');
  });

  it('replaces control characters', () => {
    expect(sanitizeFilename('file\u0000name\u0001.txt')).toBe('file_name_.txt');
  });

  it('replaces reserved names "." and ".."', () => {
    expect(sanitizeFilename('.')).toBe('_');
    expect(sanitizeFilename('..')).toBe('_');
  });

  it('replaces Windows reserved names', () => {
    const reserved = ['con', 'prn', 'aux', 'nul', 'COM1', 'LPT1', 'com9', 'lpt9'];
    for (const name of reserved) {
      expect(sanitizeFilename(name)).toBe('_');
      expect(sanitizeFilename(name.toUpperCase())).toBe('_');
    }
  });

  it('returns default replacement for empty input', () => {
    expect(sanitizeFilename('')).toBe('_');
    expect(sanitizeFilename(null as unknown as string)).toBe('_');
    expect(sanitizeFilename(undefined as unknown as string)).toBe('_');
  });

  it('uses the replacement option', () => {
    expect(sanitizeFilename('file/name', { replacement: '-' })).toBe('file-name');
  });

  it('falls back to default replacement for invalid replacement', () => {
    expect(sanitizeFilename('file/name', { replacement: '/' })).toBe('file_name');
    expect(sanitizeFilename('file/name', { replacement: '\u0000' })).toBe('file_name');
  });

  it('limits output to 255 characters', () => {
    const longName = 'a'.repeat(300) + '.txt';
    expect(sanitizeFilename(longName).length).toBe(255);
  });

  it('returns replacement for input with only illegal/control chars', () => {
    expect(sanitizeFilename('\u0000\u0001\u0002')).toBe('___');
    expect(sanitizeFilename('////')).toBe('____');
  });

  it('returns unchanged valid filename', () => {
    expect(sanitizeFilename('valid_filename.txt')).toBe('valid_filename.txt');
  });

  it('ignores illegal replacement chars', () => {
    expect(sanitizeFilename('file/name', { replacement: '*' })).toBe('file_name');
  });

  it('ignores control char replacement', () => {
    expect(sanitizeFilename('file/name', { replacement: '\u0000' })).toBe('file_name');
  });

});