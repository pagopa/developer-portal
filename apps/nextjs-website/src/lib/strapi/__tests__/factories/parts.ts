import { StrapiPart } from '@/lib/strapi/types/part';

export function minimalAlertPart(): StrapiPart {
  return {
    __component: 'parts.alert',
    severity: 'info',
  };
}

export function minimalApiTesterPart(): StrapiPart {
  return {
    __component: 'parts.api-tester',
    requestDescription: '',
    requestAttributes: [],
    requestCode: {
      code: '',
      __component: 'parts.code-block',
    },
    responseDescription: '',
    responseCode: {
      code: '',
      __component: 'parts.code-block',
    },
  };
}

export function minimalCodeBlockPart(): StrapiPart {
  return {
    __component: 'parts.code-block',
    code: '',
  };
}

export function minimalHtmlPart(): StrapiPart {
  return {
    __component: 'parts.html',
    html: [],
  };
}

export function minimalEmbedHtmlPart(): StrapiPart {
  return {
    __component: 'parts.embed-html',
    html: '',
  };
}

export function minimalQuotePart(): StrapiPart {
  return {
    __component: 'parts.quote',
    text: '',
    backgroundImage: { name: '', ext: '', mime: '', size: 0, url: '' },
  };
}

export function minimalCkEditorPart(): StrapiPart {
  return {
    __component: 'parts.ck-editor',
    content: '',
  };
}
