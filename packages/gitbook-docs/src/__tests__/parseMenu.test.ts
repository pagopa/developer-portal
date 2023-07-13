import Markdoc from '@markdoc/markdoc';
import { parseMenu } from '../parseMenu';
import fs from 'fs';

const exampleMenu = fs.readFileSync(
  '/Users/rakhov/code/work/developer-portal/packages/gitbook-docs/examples/SUMMARY-0.md',
  'utf-8'
);
const config = {
  linkPrefix: '/link/prefix',
  assetsPrefix: '/assets/prefix',
};

describe('parseMenu', () => {
  it('should append linkPrefix to links', () => {
    expect(parseMenu('[🏠 Guida](README.md)', config)).toStrictEqual([
      new Markdoc.Tag('a', { href: `${config.linkPrefix}/` }, ['🏠 Guida']),
    ]);
    expect(parseMenu('[🕗 Changelog](changelog.md)', config)).toStrictEqual([
      new Markdoc.Tag('a', { href: `${config.linkPrefix}/changelog` }, [
        '🕗 Changelog',
      ]),
    ]);
    expect(parseMenu('[🔢 Setup](p-e/README.md)', config)).toStrictEqual([
      new Markdoc.Tag('a', { href: `${config.linkPrefix}/p-e` }, ['🔢 Setup']),
    ]);
    expect(parseMenu('[Adesione](s-i/a-t.md)', config)).toStrictEqual([
      new Markdoc.Tag('a', { href: `${config.linkPrefix}/s-i/a-t` }, [
        'Adesione',
      ]),
    ]);
  });

  it('tmp', () => {
    parseMenu(exampleMenu, config);
    expect(true).toBeTruthy();
  });
});
