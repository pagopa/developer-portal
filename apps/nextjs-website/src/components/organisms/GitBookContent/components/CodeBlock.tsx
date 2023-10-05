import { CodeBlockProps } from 'gitbook-docs/markdoc/schema/code';
import { ReactNode } from 'react';
import CodeBlockPart from '@/components/molecules/CodeBlockPart/CodeBlockPart';

const CodeBlock = ({
  language,
  lineNumbers,
  overflow,
  children,
}: CodeBlockProps<ReactNode>) => {
  const isString = typeof children === 'string';

  return (
    <CodeBlockPart
      code={isString ? children : ''}
      language={language || ''}
      showLineNumbers={lineNumbers}
      wrapLines={overflow === 'wrap'}
    />
  );
};

export default CodeBlock;
