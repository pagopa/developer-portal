import Markdoc from '@markdoc/markdoc';
import { parseContent } from '../parseContent';

const config = {
  linkPrefix: '/link/prefix',
  assetsPrefix: '/assets/prefix',
};

describe('parseContent', () => {
  it('should parse paragraph', () => {
    expect(parseContent('This is a paragraph', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['This is a paragraph']),
    ]);
  });

  it('should parse hint', () => {
    expect(
      parseContent('{% hint style="info" %}\nText\n{% endhint %}\nText', config)
    ).toStrictEqual([
      new Markdoc.Tag(
        'Hint',
        {
          style: 'info',
        },
        [new Markdoc.Tag('Paragraph', {}, ['Text'])]
      ),
      new Markdoc.Tag('Paragraph', {}, ['Text']),
    ]);
  });

  it('should parse Image', () => {
    expect(
      parseContent(
        '<figure><img src="img-src.jpg" alt="anAlt"></figure>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Figure',
          {
            src: `${config.assetsPrefix}/img-src.jpg`,
            alt: 'anAlt',
          },
          []
        ),
      ]),
    ]);
    expect(
      parseContent(
        '<figure><img src="img-src.jpg" alt="anAlt"><figcaption>Caption</figcaption></figure>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Figure',
          {
            src: `${config.assetsPrefix}/img-src.jpg`,
            alt: 'anAlt',
          },
          ['Caption']
        ),
      ]),
    ]);
  });

  it('should parse swagger', () => {
    expect(
      parseContent(
        '{% swagger src="index.yaml" path="/p" method="post" %}\n[index.yaml](index.yaml)\n{% endswagger %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'Swagger',
        {
          src: 'index.yaml',
          path: '/p',
          method: 'post',
        },
        []
      ),
    ]);
  });
});
