import { Part } from '@/lib/types/part';
import React, { ReactNode } from 'react';
import TypographyPart from '@/components/atoms/TypographyPart/TypographyPart';
import InnerHtmlPart from '@/components/atoms/InnerHtmlPart/InnerHtmlPart';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import AlertPart from '@/components/atoms/AlertPart/AlertPart';
import ApiTesterPart from '@/components/organisms/ApiTesterPart/ApiTesterPart';

type PartRendererProps = {
  part: Part;
};

const PartRenderer = ({ part }: PartRendererProps): ReactNode | null => {
  switch (part.component) {
    case 'alert':
      return <AlertPart {...part} />;
    case 'apiTester':
      return <ApiTesterPart {...part} />;
    case 'codeBlock':
      return <CodeBlockPart {...part} />;
    case 'innerHTML':
      return <InnerHtmlPart html={part.html} />;
    case 'typography':
      return <TypographyPart {...part} />;
    default:
      return null;
  }
};

export default PartRenderer;
