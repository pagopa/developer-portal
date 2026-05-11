import path from 'path';

const FIXTURES_DOCS_PATH = path.resolve(__dirname, 'fixtures/docs');

jest.mock('../helpers/documentationParsing.helper', () => ({
  DOCUMENTATION_PATH: FIXTURES_DOCS_PATH,
}));

// Import after mock so the module-level DOCUMENTATION_ABSOLUTE_PATH uses the mock
import { sitePathFromLocalPath } from '../helpers/sitePathFromLocalPath';

const fixture = (...parts: readonly string[]) =>
  path.resolve(FIXTURES_DOCS_PATH, ...parts);

describe('sitePathFromLocalPath', () => {
  it('should return the path after the directory name', () => {
    expect(
      sitePathFromLocalPath(fixture('dirName', 'subdir', 'file.md'), 'dirName')
    ).toBe('subdir/file');
  });

  it('should not strip the dirName prefix if the directory name is not found', () => {
    expect(
      sitePathFromLocalPath(
        fixture('dirName', 'subdir', 'file.md'),
        'otherDirName'
      )
    ).toBe('dirName/subdir/file');
  });

  it('should return the path after a nested dirName (e.g. dirName is "dirName/subdir")', () => {
    expect(
      sitePathFromLocalPath(
        fixture('dirName', 'subdir', 'file.md'),
        'dirName/subdir'
      )
    ).toBe('file');
  });

  it('should return undefined when the landingFile matches the extracted path', () => {
    expect(
      sitePathFromLocalPath(
        fixture('dirName', 'subdir', 'file.md'),
        'dirName',
        'subdir'
      )
    ).toBeUndefined();
  });

  it('should return undefined when a nested dirName landingFile matches the extracted path', () => {
    expect(
      sitePathFromLocalPath(
        fixture('dirName', 'subdir', 'landing', 'file.md'),
        'dirName/subdir',
        'landing'
      )
    ).toBeUndefined();
  });

  it('should return the directory path for README.md files', () => {
    expect(
      sitePathFromLocalPath(
        fixture('dirName', 'subdir', 'README.md'),
        'dirName'
      )
    ).toBe('subdir');
  });

  it('should return the directory path for README.md files with a nested dirName', () => {
    expect(
      sitePathFromLocalPath(
        fixture('dirName', 'subdir', 'nested', 'README.md'),
        'dirName/subdir'
      )
    ).toBe('nested');
  });

  it('should handle paths with multiple nested levels', () => {
    expect(
      sitePathFromLocalPath(
        fixture('dirName', 'level1', 'level2', 'level3', 'file.md'),
        'dirName'
      )
    ).toBe('level1/level2/level3/file');
  });

  it('should return the filename without extension for a single file under dirName', () => {
    expect(
      sitePathFromLocalPath(fixture('dirName', 'file.md'), 'dirName')
    ).toBe('file');
  });

  it('should return an empty string for a README.md at the root of dirName', () => {
    expect(
      sitePathFromLocalPath(fixture('dirName', 'README.md'), 'dirName')
    ).toBe('');
  });
});
