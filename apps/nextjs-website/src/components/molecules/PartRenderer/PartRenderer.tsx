import { Part } from '@/lib/types/part';
import React, { ReactNode } from 'react';
import { ComponentType } from '@/lib/enums/componentType';
import TypographyPart, {
  TypographyPartProps,
} from '@/components/atoms/TypographyPart/TypographyPart';
import InnerHtmlPart, {
  InnerHtmlPartProps,
} from '@/components/atoms/InnerHtmlPart/InnerHtmlPart';

type PartRendererProps = {
  part: Part;
};

const PartRenderer = ({ part }: PartRendererProps): ReactNode | null => {
  switch (part.componentType) {
    case ComponentType.codeBlock:
      return <div>{JSON.stringify(part.props)}</div>;
    case ComponentType.innerHTML:
      return <InnerHtmlPart html={(part.props as InnerHtmlPartProps).html} />;
    case ComponentType.typography:
      return <TypographyPart {...(part.props as TypographyPartProps)} />;
    default:
      return null;
  }
};

export default PartRenderer;
