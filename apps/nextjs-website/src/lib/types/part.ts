import { AlertPartProps } from '@/components/atoms/AlertPart/AlertPart';
import { ApiTesterPartProps } from '@/components/organisms/ApiTesterPart/ApiTesterPart';
import { CodeBlockPartProps } from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import { InnerHtmlPartProps } from '@/components/atoms/InnerHtmlPart/InnerHtmlPart';
import { TypographyPartProps } from '@/components/atoms/TypographyPart/TypographyPart';

export type Part =
  | (AlertPartProps & { readonly componentType: 'alert' })
  | (ApiTesterPartProps & { readonly componentType: 'apiTester' })
  | (CodeBlockPartProps & { readonly componentType: 'codeBlock' })
  | (InnerHtmlPartProps & { readonly componentType: 'innerHTML' })
  | (TypographyPartProps & { readonly componentType: 'typography' });
