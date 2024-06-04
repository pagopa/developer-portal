import { AlertPartProps } from '@/components/atoms/AlertPart/AlertPart';
import { ApiTesterPartProps } from '@/components/organisms/ApiTesterPart/ApiTesterPart';
import { CodeBlockPartProps } from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import { InnerHtmlLazyLoadedPartProps } from '@/components/atoms/InnerHtmlLazyLoadedPart/InnerHtmlLazyLoadedPart';
import { TypographyPartProps } from '@/components/atoms/TypographyPart/TypographyPart';
import { BlocksRendererPartProps } from '@/components/organisms/BlocksRendererPart/BlocksRendererPart';

export type Part =
  | (AlertPartProps & { readonly component: 'alert' })
  | (ApiTesterPartProps & { readonly component: 'apiTester' })
  | (BlocksRendererPartProps & { readonly component: 'blockRenderer' })
  | (CodeBlockPartProps & { readonly component: 'codeBlock' })
  | (TypographyPartProps & { readonly component: 'typography' })
  | (InnerHtmlLazyLoadedPartProps & {
      readonly component: 'innerHTMLLazyLoaded';
    });
