import { Tag } from '@markdoc/markdoc';
import { transform } from '..';

describe('transform', () => {
  it('should transform file', () => {
    const markdown =
      '{% file src="../.gitbook/assets/example-0.pdf" %} \n {% file src="../.gitbook/assets/example-1.zip" %}';
    const actual = transform(markdown);
    const expected = new Tag('Document', {}, [
      new Tag('File', {
        src: '../.gitbook/assets/example-0.pdf',
      }),
      new Tag('File', {
        src: '../.gitbook/assets/example-1.zip',
      }),
    ]);
    expect(actual).toStrictEqual(expected);
  });

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
