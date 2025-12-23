import { StrapiPart } from '@/lib/strapi/types/part';

export const alertPart: StrapiPart = {
  __component: 'parts.alert',
  text: 'Alert text',
  title: 'Alert title',
  severity: 'info',
};

export const apiTesterPart: StrapiPart = {
  __component: 'parts.api-tester',
  requestDescription: 'Request description',
  requestAttributes: [{ value: 'attr1', label: 'Attribute 1' }],
  requestCode: {
    code: 'request code',
    language: 'js',
    showLineNumbers: true,
    __component: 'parts.code-block',
  },
  responseDescription: 'Response description',
  responseCode: {
    code: 'response code',
    language: 'js',
    showLineNumbers: false,
    __component: 'parts.code-block',
  },
};

export const codeBlockPart: StrapiPart = {
  __component: 'parts.code-block',
  code: 'console.log("Hello")',
  language: 'js',
  showLineNumbers: true,
};

export const htmlPart: StrapiPart = {
  __component: 'parts.html',
  html: [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'HTML content' }],
    },
  ],
};

export const embedHtmlPart: StrapiPart = {
  __component: 'parts.embed-html',
  html: '<div>Embed HTML</div>',
};

export const quotePart: StrapiPart = {
  __component: 'parts.quote',
  text: 'Quote text',
  backgroundImage: {
    url: 'https://example.com/image.jpg',
    alternativeText: 'Alt text',
    name: '',
    ext: '',
    mime: '',
    size: 0,
  },
};

export const ckEditorPart: StrapiPart = {
  __component: 'parts.ck-editor',
  content: '<p>CKEditor content</p>',
};
