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
});
