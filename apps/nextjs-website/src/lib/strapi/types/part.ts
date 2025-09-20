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
};

type ApiTesterPart = {
  readonly requestDescription: string;
  readonly requestAttributes: readonly ApiTesterAttribute[];
  readonly requestCode: CodeBlockPart;
  readonly responseDescription: string;
  readonly responseCode: CodeBlockPart;
  readonly __component: 'parts.api-tester';
};

type CkEditorPart = {
  readonly content: string;
  readonly __component: 'parts.ck-editor';
};

type CkEditorHtmlPart = {
  readonly content: string;
  readonly __component: 'parts.ck-editor-html';
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

export type StrapiPart =
  | AlertPart
  | ApiTesterPart
  | CkEditorPart
  | CodeBlockPart
  | EmbedHtmlPart
  | HtmlPart
  | QuotePart
  | CkEditorHtmlPart;
