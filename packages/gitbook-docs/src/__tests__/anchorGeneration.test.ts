import Markdoc from '@markdoc/markdoc';
import { parseContent } from '../parseContent';

const config = {
  assetsPrefix: '/assets/prefix',
  linkPrefix: '/to/s0',
  pagePath: '/to/s0/page/1',
  isPageIndex: false,
  spaceToPrefix: [],
  gitBookPagesWithTitle: [],
  urlReplaces: {},
};

describe('anchorGeneration', () => {
  it('should generate anchor with kebab-case and handle special characters correctly', () => {
    expect(
      parseContent('### Inserimento/Modifica/Cancellazione/Lettura', config)
    ).toStrictEqual([
      new Markdoc.Tag(
        'Heading',
        { level: 3, id: 'inserimento-modifica-cancellazione-lettura' },
        ['Inserimento/Modifica/Cancellazione/Lettura']
      ),
    ]);
  });

  it('should replace spaces with dashes and handle deprecated tag', () => {
    expect(
      parseContent('### Flussi di rendicontazione - DEPRECATED', config)
    ).toStrictEqual([
      new Markdoc.Tag(
        'Heading',
        { level: 3, id: 'flussi-di-rendicontazione-deprecated' },
        ['Flussi di rendicontazione - DEPRECATED']
      ),
    ]);
  });

  it('should handle multiple dashes and trim', () => {
    expect(parseContent('###  Title with   spaces  ', config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 3, id: 'title-with-spaces' }, [
        'Title with   spaces',
      ]),
    ]);
  });
});
