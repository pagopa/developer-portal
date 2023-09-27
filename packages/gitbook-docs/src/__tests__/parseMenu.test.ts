import Markdoc from '@markdoc/markdoc';
import { parseMenu } from '../parseMenu';

const config = {
  linkPrefix: '/link/prefix',
  assetsPrefix: '/assets/prefix',
};

describe('parseMenu', () => {
  it('should not render h1 elements', () => {
    expect(parseMenu('# Header 1', config)).toStrictEqual([]);
  });

  it('should render h2 as Title', () => {
    expect(parseMenu('## Header 2', config)).toStrictEqual([
      new Markdoc.Tag('Title', {}, ['Header 2']),
    ]);
  });

  it('should fill the isLeaf attribute without error', () => {
    expect(parseMenu('* [Page](page.md)', config)).toStrictEqual([
      new Markdoc.Tag('Item', {
        isLeaf: true,
        href: `${config.linkPrefix}/page`,
        title: 'Page',
      }),
    ]);
    expect(
      parseMenu('* [Page](page.md)\n    * [Child](page/child.md)', config)
    ).toStrictEqual([
      new Markdoc.Tag(
        'Item',
        {
          isLeaf: false,
          href: `${config.linkPrefix}/page`,
          title: 'Page',
        },
        [
          new Markdoc.Tag('Item', {
            isLeaf: true,
            href: `${config.linkPrefix}/page/child`,
            title: 'Child',
          }),
        ]
      ),
    ]);
  });

  it('should remove invalid characters from the text of the link', () => {
    expect(parseMenu('[🏠  G e C](README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Item', { href: `${config.linkPrefix}`, title: 'G e C' }),
    ]);
  });

  it('should convert href as expected', () => {
    expect(parseMenu('[Guida](README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Item', { href: `${config.linkPrefix}`, title: 'Guida' }),
    ]);
    expect(parseMenu('[Changelog](changelog.md)', config)).toStrictEqual([
      new Markdoc.Tag('Item', {
        href: `${config.linkPrefix}/changelog`,
        title: 'Changelog',
      }),
    ]);
    expect(parseMenu('[Setup](p-e/README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Item', {
        href: `${config.linkPrefix}/p-e`,
        title: 'Setup',
      }),
    ]);
    expect(parseMenu('[Adesione](s-i/a-t.md)', config)).toStrictEqual([
      new Markdoc.Tag('Item', {
        href: `${config.linkPrefix}/s-i/a-t`,
        title: 'Adesione',
      }),
    ]);
  });

  it('should not convert external href', () => {
    expect(parseMenu('[Ext](http://pagopa.it)', config)).toStrictEqual([
      new Markdoc.Tag('Item', { href: 'http://pagopa.it', title: 'Ext' }),
    ]);
    expect(parseMenu('[Ext](https://pagopa.it)', config)).toStrictEqual([
      new Markdoc.Tag('Item', { href: 'https://pagopa.it', title: 'Ext' }),
    ]);
  });
});
