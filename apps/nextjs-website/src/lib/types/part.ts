import { AlertPartProps } from '@/components/atoms/AlertPart/AlertPart';
import { ApiTesterPartProps } from '@/components/organisms/ApiTesterPart/ApiTesterPart';
import { CodeBlockPartProps } from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import { InnerHtmlPartProps } from '@/components/atoms/InnerHtmlPart/InnerHtmlPart';
import { TypographyPartProps } from '@/components/atoms/TypographyPart/TypographyPart';

export type Part =
  | (AlertPartProps & { readonly component: 'alert' })
  | (ApiTesterPartProps & { readonly component: 'apiTester' })
  | (CodeBlockPartProps & { readonly component: 'codeBlock' })
  | (InnerHtmlPartProps & { readonly component: 'innerHTML' })
  | (TypographyPartProps & { readonly component: 'typography' });
