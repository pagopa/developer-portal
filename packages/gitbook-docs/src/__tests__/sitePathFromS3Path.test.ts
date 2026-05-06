import { sitePathFromS3Path } from '../helpers/sitePathFromS3Path';

describe('sitePathFromS3Path', () => {
  it('should return the path after the directory name', () => {
    expect(
      sitePathFromS3Path(
        'devportal-docs/docs/dirName/subdir/file.md',
        'dirName'
      )
    ).toBe('subdir/file');
  });
  it('should return undefined if the directory name is not found', () => {
    expect(
      sitePathFromS3Path(
        'devportal-docs/docs/dirName/subdir/file.md',
        'otherDirName'
      )
    ).toBeUndefined();
  });
  it('should return the path after a nested dirName (e.g. dirName is "dirName/subdir")', () => {
    expect(
      sitePathFromS3Path(
        'devportal-docs/docs/dirName/subdir/file.md',
        'dirName/subdir'
      )
    ).toBe('file');
  });
  it('should return undefined when the landingFile matches the extracted path', () => {
    expect(
      sitePathFromS3Path(
        'devportal-docs/docs/dirName/subdir/file.md',
        'dirName',
        'subdir'
      )
    ).toBeUndefined();
  });
  it('should return undefined when a nested dirName landingFile matches the extracted path', () => {
    expect(
      sitePathFromS3Path(
        'devportal-docs/docs/dirName/subdir/landing/file.md',
        'dirName/subdir',
        'landing'
      )
    ).toBeUndefined();
  });
  it('should return the directory path for README.md files', () => {
    expect(
      sitePathFromS3Path(
        'devportal-docs/docs/dirName/subdir/README.md',
        'dirName'
      )
    ).toBe('subdir');
  });
  it('should return the directory path for README.md files with a nested dirName', () => {
    expect(
      sitePathFromS3Path(
        'devportal-docs/docs/dirName/subdir/nested/README.md',
        'dirName/subdir'
      )
    ).toBe('nested');
  });
});
