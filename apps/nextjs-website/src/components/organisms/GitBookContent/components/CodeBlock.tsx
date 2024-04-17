import { CodeBlockProps } from 'gitbook-docs/markdoc/schema/code';
import { ReactNode } from 'react';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';
import MermaidDiagram from '@/components/atoms/MermaidDiagram/MermaidDiagram';

const CodeBlock = ({
  language,
  lineNumbers,
  children,
}: CodeBlockProps<ReactNode>) => {
  if (language === 'mermaid' && typeof children === 'string') {
    return <MermaidDiagram chart={children} />;
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
