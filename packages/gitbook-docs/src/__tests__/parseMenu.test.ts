import Markdoc from '@markdoc/markdoc';
import { parseMenu } from '../parseMenu';

const config = {
  linkPrefix: '/link/prefix',
  assetsPrefix: '/assets/prefix',
};

describe('parseMenu', () => {
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

  it('should append linkPrefix to links', () => {
    expect(parseMenu('[🏠 Guida](README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}/` }, ['🏠 Guida']),
    ]);
    expect(parseMenu('[🕗 Changelog](changelog.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}/changelog` }, [
        '🕗 Changelog',
      ]),
    ]);
    expect(parseMenu('[🔢 Setup](p-e/README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}/p-e` }, [
        '🔢 Setup',
      ]),
    ]);
    expect(parseMenu('[Adesione](s-i/a-t.md)', config)).toStrictEqual([
      new Markdoc.Tag('Link', { href: `${config.linkPrefix}/s-i/a-t` }, [
        'Adesione',
      ]),
    ]);
  });
});
