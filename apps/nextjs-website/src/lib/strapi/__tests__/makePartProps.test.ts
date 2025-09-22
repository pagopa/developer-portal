import { makePart } from '@/lib/strapi/makeProps/makePart';
import {
  alertPart,
  apiTesterPart,
  codeBlockPart,
  htmlPart,
  embedHtmlPart,
  quotePart,
  ckEditorPart,
} from '@/lib/strapi/__tests__/fixtures/parts';
import {
  minimalAlertPart,
  minimalApiTesterPart,
  minimalCodeBlockPart,
  minimalHtmlPart,
  minimalEmbedHtmlPart,
  minimalQuotePart,
  minimalCkEditorPart,
} from '@/lib/strapi/__tests__/factories/parts';

describe('makePartProps', () => {
  it('should transform alert part', () => {
    const result = makePart(alertPart);
    expect(result).toMatchObject({
      component: 'alert',
      text: 'Alert text',
      title: 'Alert title',
      severity: 'info',
    });
  });

  it('should transform minimal alert part', () => {
    const result = makePart(minimalAlertPart());
    expect(result).toMatchObject({
      component: 'alert',
      severity: 'info',
    });
  });

  it('should transform api-tester part', () => {
    const result = makePart(apiTesterPart);
    expect(result).toMatchObject({
      component: 'apiTester',
      apiRequest: {
        code: 'request code',
        language: 'js',
        showLineNumbers: true,
        description: 'Request description',
        attributes: [{ value: 'attr1', label: 'Attribute 1' }],
      },
      apiResponse: {
        code: 'response code',
        language: 'js',
        showLineNumbers: false,
        description: 'Response description',
      },
    });
  });

  it('should transform code-block part', () => {
    const result = makePart(codeBlockPart);
    expect(result).toMatchObject({
      component: 'codeBlock',
      code: 'console.log("Hello")',
      language: 'js',
      showLineNumbers: true,
    });
  });

  it('should transform html part', () => {
    const result = makePart(htmlPart);
    expect(result).toMatchObject({
      component: 'blockRenderer',
      html: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'HTML content' }],
        },
      ],
    });
  });

  it('should transform embed-html part', () => {
    const result = makePart(embedHtmlPart);
    expect(result).toMatchObject({
      component: 'innerHTMLLazyLoaded',
      html: '<div>Embed HTML</div>',
    });
  });

  it('should transform quote part', () => {
    const result = makePart(quotePart);
    expect(result).toMatchObject({
      component: 'quote',
      quote: 'Quote text',
      backgroundImage: {
        url: 'https://example.com/image.jpg',
        alternativeText: 'Alt text',
      },
    });
  });

  it('should transform ck-editor part', () => {
    const result = makePart(ckEditorPart);
    expect(result).toHaveProperty('component', 'ckEditor');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('menuItems');
  });

  it('should return null for unknown part type', () => {
    const result = makePart({ __component: 'parts.unknown' } as any);
    expect(result).toBeNull();
  });

  it('should handle minimal parts', () => {
    expect(makePart(minimalApiTesterPart())).toHaveProperty(
      'component',
      'apiTester'
    );
    expect(makePart(minimalCodeBlockPart())).toHaveProperty(
      'component',
      'codeBlock'
    );
    expect(makePart(minimalHtmlPart())).toHaveProperty(
      'component',
      'blockRenderer'
    );
    expect(makePart(minimalEmbedHtmlPart())).toHaveProperty(
      'component',
      'innerHTMLLazyLoaded'
    );
    expect(makePart(minimalQuotePart())).toHaveProperty(
      'component',
      'quote'
    );
    expect(makePart(minimalCkEditorPart())).toHaveProperty(
      'component',
      'ckEditor'
    );
  });
});
