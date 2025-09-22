'use client';
import { PartData } from '@/lib/types/part';
import React, { ReactNode } from 'react';
import TypographyPart from '@/components/atoms/TypographyPart/TypographyPart';
import InnerHtmlLazyLoadedPart from '@/components/atoms/InnerHtmlLazyLoadedPart/InnerHtmlLazyLoadedPart';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import AlertPart from '@/components/atoms/AlertPart/AlertPart';
import ApiTesterPart from '@/components/organisms/ApiTesterPart/ApiTesterPart';
import BlocksRendererPart from '@/components/organisms/BlocksRendererPart/BlocksRendererPart';
import Quote from '@/components/atoms/Quote/Quote';
import CkEditorPart from '../CkEditorPart/CkEditorPart';

type PartRendererProps = {
  part: PartData;
};

const PartRenderer = ({ part }: PartRendererProps): ReactNode | null => {
  switch (part.component) {
    case 'alert':
      return <AlertPart {...part} />;
    case 'quote':
      return <Quote {...part} />;
    case 'apiTester':
      return <ApiTesterPart {...part} />;
    case 'blockRenderer':
      return <BlocksRendererPart {...part} />;
    case 'codeBlock':
      return <CodeBlockPart {...part} />;
    case 'innerHTMLLazyLoaded':
      return <InnerHtmlLazyLoadedPart html={part.html} />;
    case 'typography':
      return <TypographyPart {...part} />;
    case 'ckEditor':
      return <CkEditorPart {...part} />;
    default:
      return null;
  }
};

export default PartRenderer;
