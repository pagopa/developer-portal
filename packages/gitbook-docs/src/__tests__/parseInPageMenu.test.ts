import Markdoc from '@markdoc/markdoc';
import { parseInPageMenu } from '../parseInPageMenu';

const config = {
  assetsPrefix: '/assets/prefix',
  linkPrefix: '/link/prefix',
  pagePath: '/path/to/page',
  isPageIndex: false,
};

describe('parseInPageMenu', () => {
  it('should return only heading elements included in HEADING_LEVELS_TO_SHOW array', () => {
    expect(
      parseInPageMenu(
        '# Title 1\n## Title 2\n### Title 3\n#### Title 4\nParagraph',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 2, id: 'title-2' }, ['Title 2']),
    ]);
  });
});
