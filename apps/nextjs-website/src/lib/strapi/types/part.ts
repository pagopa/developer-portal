import { BlocksContent } from '@strapi/blocks-react-renderer';
import { StrapiMedia } from '@/lib/strapi/types/media';

type AlertPart = {
  readonly text?: string;
  readonly title?: string;
  readonly severity: 'success' | 'info' | 'warning' | 'error';
  readonly __component: 'parts.alert';
};

type ApiTesterAttribute = {
  readonly value: string;
  readonly label?: string;
  readonly __component: 'parts.api-tester.attribute';
};

type CkEditorPart = {
  readonly content: string;
  readonly __component: 'parts.ck-editor';
};

type CodeBlockPart = {
  readonly code: string;
  readonly language?: string;
  readonly showLineNumbers?: boolean;
  readonly __component: 'parts.code-block';
};

type EmbedHtmlPart = {
  readonly html: string;
  readonly __component: 'parts.embed-html';
};

type HtmlPart = {
  readonly html: BlocksContent;
  readonly __component: 'parts.html';
};

type QuotePart = {
  readonly backgroundImage: {
    readonly data?: StrapiMedia;
  };
  readonly text: string;
  readonly __component: 'parts.quote';
};

export type Part =
  | AlertPart
  | ApiTesterAttribute
  | CkEditorPart
  | CodeBlockPart
  | EmbedHtmlPart
  | HtmlPart
  | QuotePart;
