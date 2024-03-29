import { selectEmbedType } from '../../helpers/embed.helpers';

describe('selectEmbedType', () => {
  it('returns "codepen" for a CodePen URL', () => {
    const url = 'https://codepen.io/somepen';

    expect(selectEmbedType(url)).toBe('codepen');
  });

  it('returns "figma" for a matching Figma URL', () => {
    const url =
      'https://www.figma.com/file/pwhBMrDMLW6wfWcjuAOCka/Linee-Guida-Brand-pagoPA';

    expect(selectEmbedType(url)).toBe('figma');
  });

  it('returns "link" for a Figma URL with a wrong file id', () => {
    const url =
      'https://www.figma.com/file/pwhBMrjuAOCka/Linee-Guida-Brand-pagoPA';

    expect(selectEmbedType(url)).toBe('link');
  });

  it('returns "youtube" for a YouTube URL', () => {
    const url = 'https://www.youtube.com/watch?v=somevideo';

    expect(selectEmbedType(url)).toBe('youtube');
  });

  it('returns "link" for a URL containing codepen.io or youtube.com outside of the host part', () => {
    const url = 'https://example.com/?qp=codepen.io&other_qp=youtube.com';

    expect(selectEmbedType(url)).toBe('link');
  });

  it('returns "link" for an unknown URL', () => {
    const url = 'https://example.com';

    expect(selectEmbedType(url)).toBe('link');
  });
});
