import { CodeBlockProps } from 'gitbook-docs/markdoc/schema/code';
import { ReactNode } from 'react';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';

const CodeBlock = ({
  language,
  lineNumbers,
  overflow,
  children,
}: CodeBlockProps<ReactNode>) => {
  if (typeof children === 'string') {
    return (
      <CodeBlockPart
        code={children}
        language={language || ''}
        showLineNumbers={lineNumbers}
        wrapLines={overflow === 'wrap'}
      />
    );
  } else {
    return children;
  }
};

export default CodeBlock;
