import { ComponentType } from '@/lib/enums/componentType';
import { AlertPartProps } from '@/components/atoms/AlertPart/AlertPart';
import { CodeBlockPartProps } from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import { InnerHtmlPartProps } from '@/components/atoms/InnerHtmlPart/InnerHtmlPart';
import { TypographyPartProps } from '@/components/atoms/TypographyPart/TypographyPart';

export type Part = {
  readonly componentType: ComponentType;
  readonly props:
    | AlertPartProps
    | CodeBlockPartProps
    | InnerHtmlPartProps
    | TypographyPartProps;
};
