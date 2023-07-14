import { Part } from '@/lib/types/part';
import React, { ReactNode } from 'react';
import { ComponentType } from '@/lib/enums/componentType';
import TypographyPart, {
  TypographyPartProps,
} from '@/components/atoms/TypographyPart/TypographyPart';
import InnerHtmlPart, {
  InnerHtmlPartProps,
} from '@/components/atoms/InnerHtmlPart/InnerHtmlPart';
import CodeBlockPart, {
  CodeBlockPartProps,
} from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import AlertPart, {
  AlertPartProps,
} from '@/components/atoms/AlertPart/AlertPart';
import ApiTesterPart, {
  ApiTesterPartProps,
} from '@/components/organisms/ApiTesterPart/ApiTesterPart';

type PartRendererProps = {
  part: Part;
};

const PartRenderer = ({ part }: PartRendererProps): ReactNode | null => {
  switch (part.componentType) {
    case ComponentType.alert:
      return <AlertPart {...(part.props as AlertPartProps)} />;
    case ComponentType.apiTester:
      return <ApiTesterPart {...(part.props as ApiTesterPartProps)} />;
    case ComponentType.codeBlock:
      return <CodeBlockPart {...(part.props as CodeBlockPartProps)} />;
    case ComponentType.innerHTML:
      return <InnerHtmlPart html={(part.props as InnerHtmlPartProps).html} />;
    case ComponentType.typography:
      return <TypographyPart {...(part.props as TypographyPartProps)} />;
    default:
      return null;
  }
};

export default PartRenderer;
