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
    expect(parseMenu('* Page', config)).toStrictEqual([
      new Markdoc.Tag('List', {}, [
        new Markdoc.Tag('Item', { isLeaf: true }, ['Page']),
      ]),
    ]);
    expect(parseMenu('* Page\n    * Child', config)).toStrictEqual([
      new Markdoc.Tag('List', {}, [
        new Markdoc.Tag('Item', { isLeaf: false }, [
          'Page',
          new Markdoc.Tag('List', {}, [
            new Markdoc.Tag('Item', { isLeaf: true }, ['Child']),
          ]),
        ]),
      ]),
    ]);
  });

  it('should remove invalid characters from the text of the link', () => {
    expect(parseMenu('[🏠  G e C](README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}` }, ['G e C']),
    ]);
  });

  it('should convert href as expected', () => {
    expect(parseMenu('[Guida](README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}` }, ['Guida']),
    ]);
    expect(parseMenu('[Changelog](changelog.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}/changelog` }, [
        'Changelog',
      ]),
    ]);
    expect(parseMenu('[Setup](p-e/README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}/p-e` }, ['Setup']),
    ]);
    expect(parseMenu('[Adesione](s-i/a-t.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}/s-i/a-t` }, [
        'Adesione',
      ]),
    ]);
  });

  it('should convert href as expected', () => {
    expect(parseMenu('[Ext](http://pagopa.it)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: 'http://pagopa.it' }, ['Ext']),
    ]);
    expect(parseMenu('[Ext](https://pagopa.it)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: 'https://pagopa.it' }, ['Ext']),
    ]);
  });
});
