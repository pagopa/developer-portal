import { AlertPartData } from '@/components/atoms/AlertPart/AlertPart';
import { ApiTesterPartData } from '@/components/organisms/ApiTesterPart/ApiTesterPart';
import { CodeBlockPartData } from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import { InnerHtmlLazyLoadedPartData } from '@/components/atoms/InnerHtmlLazyLoadedPart/InnerHtmlLazyLoadedPart';
import { TypographyPartData } from '@/components/atoms/TypographyPart/TypographyPart';
import { BlocksRendererPartData } from '@/components/organisms/BlocksRendererPart/BlocksRendererPart';
import { QuoteData } from '@/components/atoms/Quote/Quote';
import { CkEditorPartData } from '@/components/molecules/CkEditorPart/CkEditorPart';

export type PartData =
  | (AlertPartData & { readonly component: 'alert' })
  | (QuoteData & { readonly component: 'quote' })
  | (ApiTesterPartData & { readonly component: 'apiTester' })
  | (BlocksRendererPartData & { readonly component: 'blockRenderer' })
  | (CodeBlockPartData & { readonly component: 'codeBlock' })
  | (TypographyPartData & { readonly component: 'typography' })
  | (CkEditorPartData & { readonly component: 'ckEditor' })
  | (InnerHtmlLazyLoadedPartData & {
      readonly component: 'innerHTMLLazyLoaded';
    });
