import { Tag } from '@markdoc/markdoc';
import { transform } from '..';

describe('transfrom', () => {
  it('should transform content-ref', () => {
    const markdown =
      '{% content-ref url="../setup-iniziale" %}\n[setup-iniziale](../setup-iniziale)\n{% endcontent-ref %}';
    const actual = transform(markdown);
    const expected = new Tag('Document', {}, [
      new Tag('PageLink', { url: '../setup-iniziale' }, ['setup-iniziale']),
    ]);
    expect(actual).toStrictEqual(expected);
  });
});
