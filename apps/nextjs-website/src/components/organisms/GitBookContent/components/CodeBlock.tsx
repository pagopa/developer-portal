import { CodeBlockProps } from 'gitbook-docs/markdoc/schema/code';
import { ReactNode } from 'react';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';

const CodeBlock = ({
  language,
  lineNumbers,
  children,
}: CodeBlockProps<ReactNode>) => {
  if (typeof children === 'string') {
    return (
      <CodeBlockPart
        code={children}
        language={language || ''}
        showLineNumbers={lineNumbers}
        wrapLines={true}
      />
    );
  } else {
    return children;
  }
};

export default CodeBlock;
