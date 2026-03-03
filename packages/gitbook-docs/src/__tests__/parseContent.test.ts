import Markdoc from '@markdoc/markdoc';
import { parseContent } from '../parseContent';

const config = {
  assetsPrefix: '/assets/prefix',
  linkPrefix: '/to/s0',
  pagePath: '/to/s0/page/1',
  isPageIndex: false,
  spaceToPrefix: [
    {
      spaceId: 's0',
      pathPrefix: '/to/s0',
    },
    {
      spaceId: 's1',
      pathPrefix: '/to/s1',
    },
  ],
  gitBookPagesWithTitle: [
    {
      path: '/to/s0/page/1',
      title: 'S0 Page 1',
    },
    {
      path: '/to/s0/home',
      title: 'S0 Home',
    },
    {
      path: '/to/s1',
      title: 'S1 Home',
    },
  ],
  urlReplaces: {
    'https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche':
      '/send/guides/modello-di-integrazione',
    'https://app.gitbook.com/s/axttcUGV65V2IVRggmvR/area-riservata/come-aderire':
      'https://docs.pagopa.it/area-riservata/area-riservata',
  },
};

describe('parseContent', () => {
  it('should properly parse the <p> tag', () => {
    expect(parseContent('<p>Hello there!</p>', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['Hello there!']),
    ]);
  });
  it('should parse heading', () => {
    expect(parseContent('# 🏠 h1🏠\n## h2', config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 1, id: 'h1' }, ['🏠 h1🏠']),
      new Markdoc.Tag('Heading', { level: 2, id: 'h2' }, ['h2']),
    ]);
    expect(
      parseContent('## h2 Title with accents like èàò', config)
    ).toStrictEqual([
      new Markdoc.Tag(
        'Heading',
        { level: 2, id: 'h2-title-with-accents-like-eao' },
        ['h2 Title with accents like èàò']
      ),
    ]);
    expect(parseContent('## **h2 title**', config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 2, id: 'h2-title' }, [
        new Markdoc.Tag('StyledText', { style: 'strong' }, ['h2 title']),
      ]),
    ]);
    expect(
      parseContent('## h2 title <a href="#code" id="code"></a>', config)
    ).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 2, id: 'h2-title' }, [
        'h2 title ',
        new Markdoc.Tag('Link', { id: 'code', href: '#code' }, []),
      ]),
    ]);
    expect(
      parseContent(
        '## `h2 title within backticks` <a href="#code" id="code"></a>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'Heading',
        { level: 2, id: 'h2-title-within-backticks' },
        [
          new Markdoc.Tag('StyledText', { style: 'code' }, [
            'h2 title within backticks',
          ]),
          '',
          new Markdoc.Tag('Link', { id: 'code', href: '#code' }, []),
        ]
      ),
    ]);
    expect(parseContent('## [link](target-link)', config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 2, id: 'link' }, [
        new Markdoc.Tag('Link', { href: 'target-link' }, ['link']),
      ]),
    ]);
  });

  it('should parse the description from frontmatter and put after the title or on beginning', () => {
    const markdown = '---\ndescription: >-\n  This is\n  a description\n---\n';
    expect(parseContent(`${markdown}# A Title`, config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 1, id: 'a-title' }, ['A Title']),
      new Markdoc.Tag('Paragraph', {}, ['This is a description']),
    ]);
    expect(parseContent(`${markdown}A paragraph`, config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['This is a description']),
      new Markdoc.Tag('Paragraph', {}, ['A paragraph']),
    ]);
  });

  it('should parse paragraph', () => {
    expect(parseContent('This is a paragraph', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['This is a paragraph']),
    ]);
  });

  it('should remove include tags', () => {
    expect(
      parseContent(
        'pre {% include "../.gitbook/includes/banner-promemoria-automatici.md" %}middle{% endinclude %} post',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['pre']),
      new Markdoc.Tag('Paragraph', {}, ['middle']),
      new Markdoc.Tag('Paragraph', {}, ['post']),
    ]);
  });

  it('should remove include tags for multiline string', () => {
    expect(
      parseContent(
        'pre {% include "../.gitbook/includes/banner-promemoria-automatici.md" %}This is a test\n \n \n test test\n\n test{% endinclude %} post',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['pre']),
      new Markdoc.Tag('Paragraph', {}, ['This is a test']),
      new Markdoc.Tag('Paragraph', {}, ['test test']),
      new Markdoc.Tag('Paragraph', {}, ['test']),
      new Markdoc.Tag('Paragraph', {}, ['post']),
    ]);
  });

  it('should preserve a single space into a td tag nested into other tags', () => {
    expect(
      parseContent(
        '<td><strong>before space</strong> <a><strong>after space</strong></a></td>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('StyledText', { style: 'strong' }, ['before space']),
      ' ',
      new Markdoc.Tag('Link', {}, [
        new Markdoc.Tag('StyledText', { style: 'strong' }, ['after space']),
      ]),
    ]);
  });
  it('should parse br correctly', () => {
    expect(parseContent('Hello<br>there', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'Hello',
        new Markdoc.Tag('Br', {}),
        'there',
      ]),
    ]);
  });

  it('should apply a rewritted url coming from the config', () => {
    expect(
      parseContent(
        '[Modello di Integrazione](https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche/path/#fragment)',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Link',
          {
            href: '/send/guides/modello-di-integrazione/path#fragment',
          },
          ['Modello di Integrazione']
        ),
      ]),
    ]);
    expect(
      parseContent(
        '[Manuale onboarding: sezione Processo di adesione](https://app.gitbook.com/s/axttcUGV65V2IVRggmvR/area-riservata/come-aderire)',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Link',
          {
            href: 'https://docs.pagopa.it/area-riservata/area-riservata',
          },
          ['Manuale onboarding: sezione Processo di adesione']
        ),
      ]),
    ]);
  });

  it('should not apply a rewritted url coming from the config if not present', () => {
    expect(
      parseContent(
        '[Modello di Integrazione](https://docs.pagopa.it/dont-exists/)',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Link',
          {
            href: 'https://docs.pagopa.it/dont-exists/',
          },
          ['Modello di Integrazione']
        ),
      ]),
    ]);
  });

  it('should parse unordered list', () => {
    expect(parseContent('* Item', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: false }, [
        new Markdoc.Tag('Item', {}, ['Item']),
      ]),
    ]);
  });

  it('should parse ordered list', () => {
    expect(parseContent('1. Item', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: true }, [
        new Markdoc.Tag('Item', {}, ['Item']),
      ]),
    ]);
  });

  it('should parse task list', () => {
    expect(parseContent('* [ ] Item', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: false }, [
        new Markdoc.Tag('Item', { checked: false }, ['Item']),
      ]),
    ]);
    expect(parseContent('* [x] Item', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: false }, [
        new Markdoc.Tag('Item', { checked: true }, ['Item']),
      ]),
    ]);
  });

  it('should parse html unordered list', () => {
    expect(parseContent('<ul><li>Item</li></ul>', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: false }, [
        new Markdoc.Tag('Item', {}, ['Item']),
      ]),
    ]);
  });

  it('should parse html ordered list', () => {
    expect(parseContent('<ol><li>Item</li></ol>', config)).toStrictEqual([
      new Markdoc.Tag('List', { ordered: true }, [
        new Markdoc.Tag('Item', {}, ['Item']),
      ]),
    ]);
  });

  it('should parse emoji and convert from name to unicode', () => {
    expect(parseContent(':sos:', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['🆘']),
    ]);
  });

  it('should parse emoji in title and convert from name to unicode', () => {
    expect(
      parseContent('## :technologist:Ideare un servizio', config)
    ).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 2, id: 'ideare-un-servizio' }, [
        '🧑‍💻Ideare un servizio',
      ]),
    ]);
  });

  it('should parse content-ref and convert to links', () => {
    expect(
      parseContent(
        `{% content-ref url="/en/pootm/guides/night-guide/1.3/what-is-sign-with-io" %}
        [what-is-sign-with-io.md](/en/pootm/guides/night-guide/1.3/what-is-sign-with-io)
        {% endcontent-ref %}`,
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'PageLink',
        { url: '/en/pootm/guides/night-guide/1.3/what-is-sign-with-io' },
        ['what-is-sign-with-io.md']
      ),
    ]);
  });

  it('should parse content-ref that opens and closes in a single line and convert to a link', () => {
    expect(
      parseContent(
        '{% content-ref url="/en/pootm/guides/night-guide/1.3/what-is-sign-with-io" %} [what-is-sign-with-io.md](/en/pootm/guides/night-guide/1.3/what-is-sign-with-io) {% endcontent-ref %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'PageLink',
        { url: '/en/pootm/guides/night-guide/1.3/what-is-sign-with-io' },
        ['what-is-sign-with-io.md']
      ),
    ]);
  });

  it('should parse multiple content-ref that opens and closes in a single line and convert to a link', () => {
    expect(
      parseContent(
        `{% content-ref url="/en/pootm/guides/night-guide/1.3/the-signature-process/prepare-the-documents" %} [prepare-the-documents](/en/pootm/guides/night-guide/1.3/the-signature-process/prepare-the-documents) {% endcontent-ref %}
        {% content-ref url="/en/pootm/guides/night-guide/1.3/request-a-signature" %} [request-a-signature](/en/pootm/guides/night-guide/1.3/request-a-signature) {% endcontent-ref %}
        {% content-ref url="verify-the-status-of-a-signature.md" %} [verify-the-status-of-a-signature.md](verify-the-status-of-a-signature.md) {% endcontent-ref %}`,
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'PageLink',
        {
          url: '/en/pootm/guides/night-guide/1.3/the-signature-process/prepare-the-documents',
        },
        ['prepare-the-documents']
      ),
      new Markdoc.Tag(
        'PageLink',
        { url: '/en/pootm/guides/night-guide/1.3/request-a-signature' },
        ['request-a-signature']
      ),
      new Markdoc.Tag(
        'PageLink',
        {
          url: 'verify-the-status-of-a-signature.md',
        },
        ['verify-the-status-of-a-signature.md']
      ),
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

  it('should parse img with external assets', () => {
    const updatedConfig = {
      ...config,
      assetsPrefix:
        'https://static-contents.dev.developer.pagopa.it/docs/B4pRrrcvPlijCdPoKvwc',
    };
    expect(
      parseContent(
        '<img src=".gitbook/assets/image.png" alt="anAlt">',
        updatedConfig
      )
    ).toStrictEqual([
      new Markdoc.Tag('Image', {
        src: `${updatedConfig.assetsPrefix}/.gitbook/assets/image.png`,
        alt: 'anAlt',
      }),
    ]);
  });

  it('should parse img', () => {
    expect(
      parseContent('<img src="img-src.jpg" alt="anAlt">', config)
    ).toStrictEqual([
      new Markdoc.Tag('Image', {
        src: `${config.assetsPrefix}/img-src.jpg`,
        alt: 'anAlt',
      }),
    ]);
    expect(
      parseContent('<img src="../../../img-src.jpg" alt="anAlt">', config)
    ).toStrictEqual([
      new Markdoc.Tag('Image', {
        src: `${config.assetsPrefix}/img-src.jpg`,
        alt: 'anAlt',
      }),
    ]);
    expect(parseContent('![an-alt](../../img-src.jpg)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Image', {
          src: `${config.assetsPrefix}/img-src.jpg`,
          alt: 'an-alt',
        }),
      ]),
    ]);
  });

  it('should parse figure', () => {
    expect(
      parseContent(
        '<figure><img src="img-src.jpg" alt="anAlt"></figure>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Image', {
          src: `${config.assetsPrefix}/img-src.jpg`,
          alt: 'anAlt',
        }),
      ]),
    ]);
    expect(
      parseContent(
        '<figure><img src="img-src.jpg" alt="anAlt"><figcaption>Caption</figcaption></figure>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Image', {
          src: `${config.assetsPrefix}/img-src.jpg`,
          alt: 'anAlt',
          caption: 'Caption',
        }),
      ]),
    ]);
  });

  it('should parse swagger', () => {
    const result = [
      new Markdoc.Tag(
        'Swagger',
        {
          src: '/assets/prefix/index.yaml',
          path: '/p',
          method: 'post',
        },
        []
      ),
    ];

    const parsed = parseContent(
      '{% swagger src="index.yaml" path="/p" method="post" %}{% endswagger %}',
      config
    );
    expect(parsed).toStrictEqual(result);
  });

  it('should parse swagger with children', () => {
    const result = [
      new Markdoc.Tag(
        'Swagger',
        {
          src: '',
          path: '/p',
          method: 'post',
        },
        [new Markdoc.Tag('Paragraph', {}, ['Text'])]
      ),
    ];

    const parsed = parseContent(
      '{% swagger src="" path="/p" method="post" %}\nText\n{% endswagger %}',
      config
    );
    expect(parsed).toStrictEqual(result);
  });

  it('should parse code block', () => {
    const code =
      '```javascript\n' +
      "console.log('Hello')\n" +
      "console.log('there')\n" +
      '```\n';
    expect(parseContent(code, config)).toStrictEqual([
      new Markdoc.Tag(
        'CodeBlock',
        {
          lineNumbers: true,
          language: 'javascript',
        },
        ["console.log('Hello')\nconsole.log('there')\n"]
      ),
    ]);
    expect(
      parseContent(
        '{% code title="i.js" overflow="wrap" lineNumbers="true" %}\n' +
          code +
          '{% endcode %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'CodeBlock',
        {
          title: 'i.js',
          overflow: 'wrap',
          lineNumbers: true,
          language: 'javascript',
        },
        ["console.log('Hello')\nconsole.log('there')\n"]
      ),
    ]);
    expect(
      parseContent(
        '{% code title="i.js" overflow="wrap" %}\n' + code + '{% endcode %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag(
        'CodeBlock',
        {
          title: 'i.js',
          overflow: 'wrap',
          language: 'javascript',
        },
        ["console.log('Hello')\nconsole.log('there')\n"]
      ),
    ]);
  });

  it('should parse file', () => {
    const prefix = config.assetsPrefix;
    expect(parseContent('{% file src="p/a-src.jpg" %}', config)).toStrictEqual([
      new Markdoc.Tag('File', {
        src: `${prefix}/p/a-src.jpg`,
        filename: 'a-src',
        caption: undefined,
      }),
    ]);
    expect(
      parseContent('{% file src="a-src.jpg" %}\nCaption\n{% endfile %}', config)
    ).toStrictEqual([
      new Markdoc.Tag('File', {
        src: `${prefix}/a-src.jpg`,
        filename: 'a-src',
        caption: 'Caption',
      }),
    ]);
  });

  it('should parse a markdown page containing more tha a file tag, with at least one tag closed with {% endfile %}', () => {
    const prefix = config.assetsPrefix;
    const markdown =
      '# H1\n' +
      '\n' +
      'This is a paragraph\n' +
      '{% file src="a.pdf" %}\n' +
      '\n' +
      '## H2\n' +
      '{% file src="a.pdf" %}\n' +
      '{% file src="a.pdf" %}\n' +
      '\n' +
      '### H3\n' +
      '\n' +
      'This is a paragraph\n' +
      '{% file src="a.pdf" %}\n' +
      'This is a paragraph\n' +
      '\n' +
      '{% file src="a.pdf" %}\n' +
      '{% file src="filewithcaption.pdf" %}\n' +
      'caption\n' +
      '{% endfile %}\n' +
      '\n' +
      'This is the last paragraph\n' +
      '{% file src="a.pdf" %}\n';

    expect(parseContent(markdown, config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 1, id: 'h1' }, ['H1']),
      new Markdoc.Tag('Paragraph', {}, ['This is a paragraph']),
      new Markdoc.Tag('File', {
        src: `${prefix}/a.pdf`,
        filename: 'a',
        caption: undefined,
      }),
      new Markdoc.Tag('Heading', { level: 2, id: 'h2' }, ['H2']),
      new Markdoc.Tag('File', {
        src: `${prefix}/a.pdf`,
        filename: 'a',
        caption: undefined,
      }),
      new Markdoc.Tag('File', {
        src: `${prefix}/a.pdf`,
        filename: 'a',
        caption: undefined,
      }),
      new Markdoc.Tag('Heading', { level: 3, id: 'h3' }, ['H3']),
      new Markdoc.Tag('Paragraph', {}, ['This is a paragraph']),
      new Markdoc.Tag('File', {
        src: `${prefix}/a.pdf`,
        filename: 'a',
        caption: undefined,
      }),
      new Markdoc.Tag('Paragraph', {}, ['This is a paragraph']),
      new Markdoc.Tag('File', {
        src: `${prefix}/a.pdf`,
        filename: 'a',
        caption: undefined,
      }),
      new Markdoc.Tag('File', {
        src: `${prefix}/filewithcaption.pdf`,
        filename: 'filewithcaption',
        caption: 'caption',
      }),
      new Markdoc.Tag('Paragraph', {}, ['This is the last paragraph']),
      new Markdoc.Tag('File', {
        src: `${prefix}/a.pdf`,
        filename: 'a',
        caption: undefined,
      }),
    ]);
  });

  it('should parse styled text', () => {
    expect(parseContent('This is **Bold**', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'This is ',
        new Markdoc.Tag('StyledText', { style: 'strong' }, ['Bold']),
      ]),
    ]);
    expect(parseContent('This is _Italic_', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'This is ',
        new Markdoc.Tag('StyledText', { style: 'italic' }, ['Italic']),
      ]),
    ]);
    expect(parseContent('This is `Code`', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'This is ',
        new Markdoc.Tag('StyledText', { style: 'code' }, ['Code']),
      ]),
    ]);
    expect(parseContent('This is ~~Strikethrough~~', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'This is ',
        new Markdoc.Tag('StyledText', { style: 'strikethrough' }, [
          'Strikethrough',
        ]),
      ]),
    ]);
  });

  it('should ignore mark tag', () => {
    expect(
      parseContent('This is <mark style="color:orange;">Mark</mark>', config)
    ).toStrictEqual([new Markdoc.Tag('Paragraph', {}, ['This is ', 'Mark'])]);
  });

  it('should parse quote', () => {
    const inlineQuote = '> « attività di riconciliazione del pagamento »';
    expect(parseContent(inlineQuote, config)).toStrictEqual([
      new Markdoc.Tag('Quote', {}, [
        new Markdoc.Tag('Paragraph', {}, [
          '« attività di riconciliazione del pagamento »',
        ]),
      ]),
    ]);

    expect(
      parseContent('> This is a quote.\n> Another line, same quote', config)
    ).toStrictEqual([
      new Markdoc.Tag('Quote', {}, [
        new Markdoc.Tag('Paragraph', {}, [
          'This is a quote.',
          ' ',
          'Another line, same quote',
        ]),
      ]),
    ]);
  });

  it('should parse tabs', () => {
    expect(
      parseContent(
        '{% tabs %}\n{% tab title="Tab 1" %}\nTab 1 Content\n{% endtab %}\n\n{% tab title="Tab 2" %}\nTab 2 Content\n{% endtab %}\n{% endtabs %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Tabs', { titles: ['Tab 1', 'Tab 2'] }, [
        new Markdoc.Tag('Paragraph', {}, ['Tab 1 Content']),
        new Markdoc.Tag('Paragraph', {}, ['Tab 2 Content']),
      ]),
    ]);

    expect(
      parseContent(
        '{% tabs %}\n{% tab title="Tab 1" %}\nTab 1 Content\n{% endtab %}\n\n{% tab title="Tab 2" %}\n\n{% endtab %}\n{% endtabs %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Tabs', { titles: ['Tab 1', 'Tab 2'] }, [
        new Markdoc.Tag('Paragraph', {}, ['Tab 1 Content']),
        '',
      ]),
    ]);

    expect(
      parseContent(
        '{% tabs %}\n{% tab title="Tab 1" %}\n{% hint style="info" %}\nText\n{% endhint %}\n{% hint style="info" %}\nText\n{% endhint %}\n{% endtab %}\n\n{% tab title="Tab 2" %}\nTab 2 Content\n{% endtab %}\n{% endtabs %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Tabs', { titles: ['Tab 1', 'Tab 2'] }, [
        new Markdoc.Tag('Paragraph', {}, [
          new Markdoc.Tag(
            'Hint',
            {
              style: 'info',
            },
            [new Markdoc.Tag('Paragraph', {}, ['Text'])]
          ),
          new Markdoc.Tag(
            'Hint',
            {
              style: 'info',
            },
            [new Markdoc.Tag('Paragraph', {}, ['Text'])]
          ),
        ]),
        new Markdoc.Tag('Paragraph', {}, ['Tab 2 Content']),
      ]),
    ]);

    const fileAttrs = {
      src: `${config.assetsPrefix}/p/a-src.jpg`,
      filename: 'a-src',
      caption: undefined,
    };

    expect(
      parseContent(
        '{% tabs %}\n{% tab title="Tab 1" %}\nTab 1 Content\n\n{% file src="p/a-src.jpg" %}\n{% endtab %}\n\n{% tab title="Tab 2" %}\nTab 2 Content\n\n{% file src="p/a-src.jpg" %}\n{% endtab %}\n{% endtabs %}',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Tabs', { titles: ['Tab 1', 'Tab 2'] }, [
        new Markdoc.Tag('Paragraph', {}, [
          new Markdoc.Tag('Paragraph', {}, ['Tab 1 Content']),
          new Markdoc.Tag('File', fileAttrs),
        ]),
        new Markdoc.Tag('Paragraph', {}, [
          new Markdoc.Tag('Paragraph', {}, ['Tab 2 Content']),
          new Markdoc.Tag('File', fileAttrs),
        ]),
      ]),
    ]);
  });

  it('should parse expandable', () => {
    expect(
      parseContent(
        '<details>\n\n<summary>A Summary</summary>\n\nA Details\n<img src="../path.jpg">\n\n</details>',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Expandable', {}, [
        new Markdoc.Tag('ExpandableSummary', {}, ['A Summary']),
        new Markdoc.Tag('ExpandableDetails', {}, [
          new Markdoc.Tag('Paragraph', {}, ['A Details']),
          new Markdoc.Tag('Image', {
            src: `${config.assetsPrefix}/path.jpg`,
          }),
        ]),
      ]),
    ]);
  });

  it('should parse table', () => {
    const table =
      '| col A | col B |\n| --------- | --------- |\n| 1 - A     | 1 - B     |\n| 2 - A     | 2 - B     |';
    expect(parseContent(table, config)).toStrictEqual([
      new Markdoc.Tag('Table', { headerIsHidden: false }, [
        new Markdoc.Tag('TableHead', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableH', {}, ['col A']),
            new Markdoc.Tag('TableH', {}, ['col B']),
          ]),
        ]),
        new Markdoc.Tag('TableBody', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['1 - A']),
            new Markdoc.Tag('TableD', {}, ['1 - B']),
          ]),
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['2 - A']),
            new Markdoc.Tag('TableD', {}, ['2 - B']),
          ]),
        ]),
      ]),
    ]);
  });

  it('should keep inline code with pipes inside tables intact', () => {
    const table =
      '| Segmento | Regex | Esempio |\n' +
      '| --- | --- | --- |\n' +
      '| Prefisso | `9/|6/|7/|8/` | `9/` |';
    expect(parseContent(table, config)).toStrictEqual([
      new Markdoc.Tag('Table', { headerIsHidden: false }, [
        new Markdoc.Tag('TableHead', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableH', {}, ['Segmento']),
            new Markdoc.Tag('TableH', {}, ['Regex']),
            new Markdoc.Tag('TableH', {}, ['Esempio']),
          ]),
        ]),
        new Markdoc.Tag('TableBody', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['Prefisso']),
            new Markdoc.Tag('TableD', {}, [
              new Markdoc.Tag('StyledText', { style: 'code' }, ['9/|6/|7/|8/']),
            ]),
            new Markdoc.Tag('TableD', {}, [
              new Markdoc.Tag('StyledText', { style: 'code' }, ['9/']),
            ]),
          ]),
        ]),
      ]),
    ]);
  });

  it('should parse paragraph inside table td', () => {
    const table =
      '| col A | col B |\n| --------- | --------- |\n| <p>1 - A</p>     | 1 - B     |\n| 2 - A     | 2 - B     |';
    expect(parseContent(table, config)).toStrictEqual([
      new Markdoc.Tag('Table', { headerIsHidden: false }, [
        new Markdoc.Tag('TableHead', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableH', {}, ['col A']),
            new Markdoc.Tag('TableH', {}, ['col B']),
          ]),
        ]),
        new Markdoc.Tag('TableBody', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, [
              new Markdoc.Tag('Paragraph', {}, ['1 - A']),
            ]),
            new Markdoc.Tag('TableD', {}, ['1 - B']),
          ]),
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['2 - A']),
            new Markdoc.Tag('TableD', {}, ['2 - B']),
          ]),
        ]),
      ]),
    ]);
  });

  it('should parse html table', () => {
    const table =
      '<table data-header-hidden>' +
      '<thead><tr>' +
      '<th width="165">col A</th>' +
      '<th width="518">col B</th>' +
      '</tr></thead>' +
      '<tbody>' +
      '<tr><td>1 - A</td><td>1 - B</td></tr><tr><td>2 - A</td><td>2 - B</td></tr>' +
      '</tbody></table>';
    expect(parseContent(table, config)).toStrictEqual([
      new Markdoc.Tag('Table', { headerIsHidden: true }, [
        new Markdoc.Tag('TableHead', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableH', {}, ['col A']),
            new Markdoc.Tag('TableH', {}, ['col B']),
          ]),
        ]),
        new Markdoc.Tag('TableBody', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['1 - A']),
            new Markdoc.Tag('TableD', {}, ['1 - B']),
          ]),
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['2 - A']),
            new Markdoc.Tag('TableD', {}, ['2 - B']),
          ]),
        ]),
      ]),
    ]);
  });

  it('should parse html table with an image inside a table data cell', () => {
    const table =
      '<table data-header-hidden>' +
      '<thead><tr>' +
      '<th width="165">col A</th>' +
      '<th width="518">col B</th>' +
      '</tr></thead>' +
      '<tbody>' +
      '<tr><td><img src="img-src.jpg" alt="anAlt"></td><td>1 - B</td></tr><tr><td>2 - A</td><td>2 - B</td></tr>' +
      '</tbody></table>';
    expect(parseContent(table, config)).toStrictEqual([
      new Markdoc.Tag('Table', { headerIsHidden: true }, [
        new Markdoc.Tag('TableHead', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableH', {}, ['col A']),
            new Markdoc.Tag('TableH', {}, ['col B']),
          ]),
        ]),
        new Markdoc.Tag('TableBody', {}, [
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, [
              new Markdoc.Tag('Image', {
                src: `${config.assetsPrefix}/img-src.jpg`,
                alt: 'anAlt',
              }),
            ]),
            new Markdoc.Tag('TableD', {}, ['1 - B']),
          ]),
          new Markdoc.Tag('TableR', {}, [
            new Markdoc.Tag('TableD', {}, ['2 - A']),
            new Markdoc.Tag('TableD', {}, ['2 - B']),
          ]),
        ]),
      ]),
    ]);
  });

  it('should parse html table viewed as cards', () => {
    const table =
      '<table data-card-size="large" data-view="cards">' +
      '<thead><tr>' +
      '<th></th>' +
      '<th data-hidden data-card-cover data-type="files"></th>' +
      '<th data-hidden data-card-target data-type="content-ref"></th>' +
      '</tr></thead>' +
      '<tbody>' +
      '<tr><td>0 - A</td><td><a href="img-0.jpg">0 - B</a></td><td><a href="ref-0.md">0 - C</a></td></tr>' +
      '<tr><td>1 - A</td><td><a href="img-1.jpg">1 - B</a></td><td><a href="ref-1.md">1 - C</a></td></tr>' +
      '</tbody></table>';
    expect(parseContent(table, config)).toStrictEqual([
      new Markdoc.Tag(
        'Cards',
        {
          size: 'large',
        },
        [
          new Markdoc.Tag(
            'Card',
            {
              coverSrc: `${config.assetsPrefix}/img-0.jpg`,
              href: 'ref-0.md',
            },
            [new Markdoc.Tag('CardItem', {}, ['0 - A'])]
          ),
          new Markdoc.Tag(
            'Card',
            {
              coverSrc: `${config.assetsPrefix}/img-1.jpg`,
              href: 'ref-1.md',
            },
            [new Markdoc.Tag('CardItem', {}, ['1 - A'])]
          ),
        ]
      ),
    ]);
  });

  it('should parse embed', () => {
    const embed =
      '{% embed url="https://www.pagopa.it/" %}\n' +
      'This is a caption\n' +
      '{% endembed %}';
    expect(parseContent(embed, config)).toStrictEqual([
      new Markdoc.Tag(
        'Embed',
        {
          url: 'https://www.pagopa.it/',
        },
        [new Markdoc.Tag('Paragraph', {}, ['This is a caption'])]
      ),
    ]);

    expect(
      parseContent('{% embed url="https://www.pagopa.it/" %}\nhi', config)
    ).toStrictEqual([
      new Markdoc.Tag('Embed', {
        url: 'https://www.pagopa.it/',
      }),
      new Markdoc.Tag('Paragraph', {}, ['hi']),
    ]);
  });

  it('should parse @figma/embed', () => {
    const embed =
      '{% @figma/embed fileId="K9NAcE1wiZJvRiGh1FLAMC" nodeId="38:245" url="https://www.figma.com/file/K9NAcE1wiZJvRiGh1FLAMC?node-id=38%3A245" %}';

    expect(parseContent(embed, config)).toStrictEqual([
      new Markdoc.Tag('Embed', {
        url: 'https://www.figma.com/file/K9NAcE1wiZJvRiGh1FLAMC?node-id=38%3A245',
      }),
    ]);
  });

  it('should parse strong html tag', () => {
    const strongText = '<strong>Text</strong>';
    expect(parseContent(strongText, config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('StyledText', { style: 'strong' }, ['Text']),
      ]),
    ]);
  });

  it('should parse mailto inside links', () => {
    expect(
      parseContent(
        '[pagamenti@assistenza.pagopa.it](mailto:pagamenti@assistenza.pagopa.it)',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Link',
          { href: 'mailto:pagamenti@assistenza.pagopa.it' },
          ['pagamenti@assistenza.pagopa.it']
        ),
      ]),
    ]);
  });

  it('should parse code blocks', () => {
    const content = '`DELETE`` `';
    expect(parseContent(content, config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('StyledText', { style: 'code' }, ['DELETE ']),
      ]),
    ]);
  });

  it('should handle data-size attribute in image', () => {
    const content = '<img src="img-src.jpg" alt="anAlt" data-size="line">';
    expect(parseContent(content, config)).toStrictEqual([
      new Markdoc.Tag('Image', {
        src: `${config.assetsPrefix}/img-src.jpg`,
        alt: 'anAlt',
        'data-size': 'line',
      }),
    ]);
  });
});
