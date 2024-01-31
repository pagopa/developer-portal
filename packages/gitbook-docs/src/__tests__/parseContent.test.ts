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
    {
      path: '/send/guides/modello-di-integrazione/v2.1/',
      title: 'Modello di Integrazione',
    },
  ],
  urlRewrites: {
    // App IO
    'https://docs.pagopa.it/manuale-operativo-dei-servizi':
      '/app-io/guides/manuale-servizi',
    'https://docs.pagopa.it/kb-enti': '/app-io/guides/supporto-agli-enti',
    'https://docs.pagopa.it/kb-enti-adesione':
      '/app-io/guides/supporto-agli-enti',
    'https://docs.pagopa.it/kb-enti-servizi':
      '/app-io/guides/supporto-agli-enti',
    'https://docs.pagopa.it/kb-enti-messaggi':
      '/app-io/guides/supporto-agli-enti',
    'https://docs.pagopa.it/kb-enti-pagamenti':
      '/app-io/guides/supporto-agli-enti',
    'https://docs.pagopa.it/kb-enti-accordi':
      '/app-io/guides/supporto-agli-enti',
    'https://docs.pagopa.it/kb-enti-assistenza':
      '/app-io/guides/supporto-agli-enti',
    'https://docs.pagopa.it/kit-di-comunicazione-per-gli-enti':
      '/app-io/guides/kit-comunicazione',
    'https://docs.pagopa.it/io-come-aderire': '/app-io/guides/accordi-adesione',

    // SEND
    'https://docs.pagopa.it/f.a.q.-per-integratori/knowledge-base-di-piattaforma-notifiche':
      '/send/guides/knowledge-base',
    'https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche':
      '/send/guides/modello-di-integrazione',

    // PagoPA
    'https://docs.pagopa.it/manuale-back-office-pagopa':
      '/pago-pa/guides/manuale-bo-ec',
    'https://docs.pagopa.it/manuale-back-office-pagopa/manuale-operativo-back-office-pagopa-ente-creditore/':
      '/pago-pa/guides/manuale-bo-ec',
    'https://docs.pagopa.it/manuale-back-office-pagopa/v/manuale-bo-pagopa-psp/':
      '/pago-pa/guides/manuale-bo-psp',
    'https://docs.pagopa.it/gestionedeglierrori': '/pago-pa/guides/errori',
    'https://docs.pagopa.it/dizionario-dei-metadata':
      '/pago-pa/guides/metadata',

    // Firma con IO
    'https://docs.pagopa.it/manuale-operativo-di-firma-con-io':
      '/firma-con-io/guides/manuale-operativo',
  },
};

describe('parseContent', () => {
  it('should ignore any <p> tag', () => {
    expect(parseContent('<p>Hello there!</p>', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, ['Hello there!']),
    ]);
  });
  it('should parse heading', () => {
    expect(parseContent('# 🏠 h1🏠\n## h2', config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 1, id: 'h1' }, ['h1']),
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
        new Markdoc.Tag('Link', { id: 'code', href: '/to/s0/page/#code' }, []),
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
          new Markdoc.Tag(
            'Link',
            { id: 'code', href: '/to/s0/page/#code' },
            []
          ),
        ]
      ),
    ]);
    expect(parseContent('## [link](target-link)', config)).toStrictEqual([
      new Markdoc.Tag('Heading', { level: 2, id: 'link' }, [
        new Markdoc.Tag('Link', { href: '/to/s0/page/target-link' }, ['link']),
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

  it('should convert href as expected', () => {
    expect(parseContent('[Guida](README.md)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s0/page' }, ['Guida']),
      ]),
    ]);
    expect(parseContent('[Guida](b.md)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s0/page/b' }, ['Guida']),
      ]),
    ]);
    expect(parseContent('[Guida](../a/b.md)', config)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s0/a/b' }, ['Guida']),
      ]),
    ]);
  });

  it('should convert href as expected given an index page', () => {
    const customConfig = { ...config, isPageIndex: true };
    expect(parseContent('[Guida](b.md)', customConfig)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s0/page/1/b' }, ['Guida']),
      ]),
    ]);
    expect(parseContent('[Guida](../a/b.md)', customConfig)).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s0/page/a/b' }, ['Guida']),
      ]),
    ]);
  });

  it('should replace the title of link', () => {
    expect(
      parseContent('Go to [page.md](../home.md "mention")', config)
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'Go to ',
        new Markdoc.Tag('Link', { title: 'mention', href: '/to/s0/home' }, [
          'S0 Home',
        ]),
      ]),
    ]);
  });

  it('should replace the title of link to an anchor with a human readable text', () => {
    expect(
      parseContent(
        'Fixed [#text-strings](#text-strings "mention") are now in JSON format',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        'Fixed ',
        new Markdoc.Tag(
          'Link',
          { title: 'mention', href: '/to/s0/page/#text-strings' },
          ['Text strings']
        ),
        ' are now in JSON format',
      ]),
    ]);
  });

  it('should convert href to other gitbook space', () => {
    expect(
      parseContent('[Page](http://localhost:5000/o/KxY/s/s1/)', config)
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s1' }, ['S1 Home']),
      ]),
    ]);
    expect(
      parseContent('[Page](http://localhost:5000/s/s0/page/1)', config)
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s0/page/1' }, ['S0 Page 1']),
      ]),
    ]);
    expect(
      parseContent('[Page](http://localhost:5000/o/xY/s/s1/ "mention")', config)
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { title: 'mention', href: '/to/s1' }, [
          'S1 Home',
        ]),
      ]),
    ]);
  });

  it('should convert 127.0.0.1 URL to other gitbook space', () => {
    expect(
      parseContent('[Page](http://127.0.0.1:5000/o/xY/s/s1/ "mention")', config)
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { title: 'mention', href: '/to/s1' }, [
          'S1 Home',
        ]),
      ]),
    ]);
    expect(
      parseContent('[Page](http://127.0.0.1:5000/o/KXY/s/s1/)', config)
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s1' }, ['S1 Home']),
      ]),
    ]);
    expect(
      parseContent('[Page](http://127.0.0.1:5000/s/s0/page/1)', config)
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag('Link', { href: '/to/s0/page/1' }, ['S0 Page 1']),
      ]),
    ]);
  });

  it('should convert docs.pagopa.it to developer portal links', () => {
    expect(
      parseContent(
        '[Modello di Integrazione](https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche/)',
        config
      )
    ).toStrictEqual([
      new Markdoc.Tag('Paragraph', {}, [
        new Markdoc.Tag(
          'Link',
          {
            href: '/send/guides/modello-di-integrazione/v2.1/',
          },
          ['Modello di Integrazione']
        ),
      ]),
    ]);
  });

  it("should not convert docs.pagopa.it to developer portal links if there's no corresponding url", () => {
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
      '{% swagger src="index.yaml" path="/p" method="post" %}\n[index.yaml](index.yaml)\n{% endswagger %}',
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
              href: '/to/s0/page/ref-0',
            },
            [new Markdoc.Tag('CardItem', {}, ['0 - A'])]
          ),
          new Markdoc.Tag(
            'Card',
            {
              coverSrc: `${config.assetsPrefix}/img-1.jpg`,
              href: '/to/s0/page/ref-1',
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

  it('should parse content-ref', () => {
    const contentRef =
      '{% content-ref url="1/" %}\n' + '[1.md](1/)\n' + '{% endcontent-ref %}';
    expect(parseContent(contentRef, config)).toStrictEqual([
      new Markdoc.Tag(
        'PageLink',
        {
          url: '/to/s0/page/1',
        },
        ['S0 Page 1']
      ),
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
});
