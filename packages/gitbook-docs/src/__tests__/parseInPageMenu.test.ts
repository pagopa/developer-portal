import Markdoc from '@markdoc/markdoc';
import { parseInPageMenu } from '../parseContent';

const config = {
  assetsPrefix: '/assets/prefix',
  linkPrefix: '/link/prefix',
  pagePath: '/path/to/page',
  isPageIndex: false,
};

describe('parseInPageMenu', () => {
  it('should return only heading elements', () => {
    expect(
      parseInPageMenu('# Title 1\n## Title 2\nParagraph', config)
    ).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 1, id: 'title-1' }, ['Title 1']),
      new Markdoc.Tag('Heading', { level: 2, id: 'title-2' }, ['Title 2']),
    ]);
  });
});
