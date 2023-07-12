import { Part } from '@/lib/types/part';
import React, { ReactNode } from 'react';
import { ComponentType } from '@/lib/enums/componentType';

type PartRendererProps = {
  part: Part;
};

const PartRenderer = ({ part }: PartRendererProps): ReactNode | null => {
  switch (part.componentType) {
    case ComponentType.codeBlock:
      return <div>{JSON.stringify(part.props)}</div>;
    case ComponentType.innerHTML:
      return <div>{JSON.stringify(part.props)}</div>;
    case ComponentType.typography:
      return <div>{JSON.stringify(part.props)}</div>;
    default:
      return null;
  }
};

export default PartRenderer;
