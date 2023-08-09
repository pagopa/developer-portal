import Markdoc from '@markdoc/markdoc';
import { parseInPageMenu } from '../parseInPageMenu';

const config = {
  assetsPrefix: '/assets/prefix',
  linkPrefix: '/link/prefix',
  pagePath: '/path/to/page',
  isPageIndex: false,
};

describe('parseInPageMenu', () => {
  it('should return only heading elements', () => {
    expect(
      parseInPageMenu('# Title 1\n## Title 2\n### Title 3\nParagraph', config)
    ).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 3, id: 'title-3' }, ['Title 3']),
    ]);
  });
});
