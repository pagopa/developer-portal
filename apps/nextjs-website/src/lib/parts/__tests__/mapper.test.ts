import { mapPartProps } from '@/lib/parts/mapper';
import {
  alertPart,
  apiTesterPart,
  codeBlockPart,
  htmlPart,
  embedHtmlPart,
  quotePart,
  ckEditorPart,
  markdownPart,
} from '@/lib/parts/__tests__/fixtures';
import {
  minimalAlertPart,
  minimalApiTesterPart,
  minimalCodeBlockPart,
  minimalHtmlPart,
  minimalEmbedHtmlPart,
  minimalQuotePart,
  minimalCkEditorPart,
  minimalMarkdownPart,
} from '@/lib/parts/__tests__/factories';

jest.mock('@/config', () => ({
  staticContentsUrl: 'https://static-contents.test.developer.pagopa.it',
  s3DocsPath: 'devportal-docs/docs',
}));

describe('makePartProps', () => {
  it('should transform alert part', () => {
    const result = mapPartProps(alertPart);
    expect(result).toMatchObject({
      component: 'alert',
      text: 'Alert text',
      title: 'Alert title',
      severity: 'info',
    });
  });

  it('should transform minimal alert part', () => {
    const result = mapPartProps(minimalAlertPart());
    expect(result).toMatchObject({
      component: 'alert',
      severity: 'info',
    });
  });

  it('should transform api-tester part', () => {
    const result = mapPartProps(apiTesterPart);
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
    const result = mapPartProps(codeBlockPart);
    expect(result).toMatchObject({
      component: 'codeBlock',
      code: 'console.log("Hello")',
      language: 'js',
      showLineNumbers: true,
    });
  });

  it('should transform html part', () => {
    const result = mapPartProps(htmlPart);
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
    const result = mapPartProps(embedHtmlPart);
    expect(result).toMatchObject({
      component: 'innerHTMLLazyLoaded',
      html: '<div>Embed HTML</div>',
    });
  });

  it('should transform quote part', () => {
    const result = mapPartProps(quotePart);
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
    const result = mapPartProps(ckEditorPart);
    expect(result).toHaveProperty('component', 'ckEditor');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('menuItems');
  });

  describe('parts.markdown', () => {
    const dict = { 'my-guide/README.md': '# Hello' };

    it('should resolve content from markdownContentDict and build assetsPrefix with explicit locale', () => {
      const result = mapPartProps(markdownPart, dict, 'en');
      expect(result).toMatchObject({
        component: 'markdown',
        content: '# Hello',
        assetsPrefix:
          'https://static-contents.test.developer.pagopa.it/en/devportal-docs/docs/my-guide',
      });
    });

    it('should return empty content when key is missing from markdownContentDict', () => {
      const result = mapPartProps(markdownPart, {}, 'en');
      expect(result).toMatchObject({
        component: 'markdown',
        content: '',
        assetsPrefix:
          'https://static-contents.test.developer.pagopa.it/en/devportal-docs/docs/my-guide',
      });
    });

    it('should default locale to "it" when no locale is provided', () => {
      const result = mapPartProps(markdownPart, dict);
      expect(result).toMatchObject({
        component: 'markdown',
        assetsPrefix:
          'https://static-contents.test.developer.pagopa.it/it/devportal-docs/docs/my-guide',
      });
    });

    it('should return empty content and correct assetsPrefix when markdownContentDict is omitted', () => {
      const result = mapPartProps(markdownPart, undefined, 'en');
      expect(result).toMatchObject({
        component: 'markdown',
        content: '',
        assetsPrefix:
          'https://static-contents.test.developer.pagopa.it/en/devportal-docs/docs/my-guide',
      });
    });

    it('should handle minimal markdown part (from factory)', () => {
      const result = mapPartProps(minimalMarkdownPart(), dict, 'it');
      expect(result).toHaveProperty('component', 'markdown');
      expect(result).toHaveProperty('content', '');
      expect(result).toHaveProperty(
        'assetsPrefix',
        'https://static-contents.test.developer.pagopa.it/it/devportal-docs/docs/some-dir'
      );
    });
  });

  it('should return null for unknown part type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = mapPartProps({ __component: 'parts.unknown' } as any);
    expect(result).toBeNull();
  });

  it('should handle minimal parts', () => {
    expect(mapPartProps(minimalApiTesterPart())).toHaveProperty(
      'component',
      'apiTester'
    );
    expect(mapPartProps(minimalCodeBlockPart())).toHaveProperty(
      'component',
      'codeBlock'
    );
    expect(mapPartProps(minimalHtmlPart())).toHaveProperty(
      'component',
      'blockRenderer'
    );
    expect(mapPartProps(minimalEmbedHtmlPart())).toHaveProperty(
      'component',
      'innerHTMLLazyLoaded'
    );
    expect(mapPartProps(minimalQuotePart())).toHaveProperty(
      'component',
      'quote'
    );
    expect(mapPartProps(minimalCkEditorPart())).toHaveProperty(
      'component',
      'ckEditor'
    );
  });
});
