import type { AlertPartProps } from '@/components/atoms/AlertPart/AlertPart';
import type { ApiTesterPartProps } from '@/components/organisms/ApiTesterPart/ApiTesterPart';
import type { CodeBlockPartProps } from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import type { InnerHtmlLazyLoadedPartProps } from '@/components/atoms/InnerHtmlLazyLoadedPart/InnerHtmlLazyLoadedPart';
import type { TypographyPartProps } from '@/components/atoms/TypographyPart/TypographyPart';
import type { BlocksRendererPartProps } from '@/components/organisms/BlocksRendererPart/BlocksRendererPart';
import type { QuoteProps } from '@/components/atoms/Quote/Quote';
import type { CkEditorPartProps } from '@/components/molecules/CkEditorPart/CkEditorPart';
import type { MarkdownPartProps } from '@/components/molecules/MarkdownPart/MarkdownPart';

export type Part =
  | (AlertPartProps & { readonly component: 'alert' })
  | (QuoteProps & { readonly component: 'quote' })
  | (ApiTesterPartProps & { readonly component: 'apiTester' })
  | (BlocksRendererPartProps & { readonly component: 'blockRenderer' })
  | (CodeBlockPartProps & { readonly component: 'codeBlock' })
  | (TypographyPartProps & { readonly component: 'typography' })
  | (CkEditorPartProps & { readonly component: 'ckEditor' })
  | (MarkdownPartProps & { readonly component: 'markdown' })
  | (InnerHtmlLazyLoadedPartProps & {
      readonly component: 'innerHTMLLazyLoaded';
    });
