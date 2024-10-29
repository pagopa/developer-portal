import { CodeBlockProps } from 'gitbook-docs/markdoc/schema/code';
import { ReactNode } from 'react';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import dynamic from 'next/dynamic';

const NoSSRMermaidDiagram = dynamic(
  () => import('../../../atoms/MermaidDiagram/MermaidDiagram'),
  { ssr: false }
);

const CodeBlock = ({
  language,
  lineNumbers,
  children,
}: CodeBlockProps<ReactNode>) => {
  if (language === 'mermaid' && typeof children === 'string') {
    return <NoSSRMermaidDiagram chart={children} />;
  }

  if (typeof children === 'string') {
    return (
      <CodeBlockPart
        code={children}
        language={language}
        showLineNumbers={lineNumbers}
        wrapLines={true}
      />
    );
  } else {
    return children;
  }
};

export default CodeBlock;
