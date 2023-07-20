import { parseContent } from 'gitbook-docs/parseContent';
import { RenderingComponents, renderContent } from 'gitbook-docs/renderContent';
import React, { ReactNode } from 'react';

type GuideContentProps = {
  assetsPrefix: string;
  content: string;
};

const components: RenderingComponents<ReactNode> = {
  Swagger: ({ src }) => <div>TODO: render Swagger element {src}</div>,
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  Hint: ({ children }) => <div>TODO: render Hint {children}</div>,
  CodeBlock: ({ children }) => <div>TODO: render code block {children}</div>,
  Figure: ({ children }) => <div>TODO: render Figure {children}</div>,
  Paragraph: ({ children }) => <div>TODO: render Paragraph {children}</div>,
  Heading: ({ level, children }) => (
    <div>
      H{level} {children}
    </div>
  ),
};

const GuideContent = ({ content, assetsPrefix }: GuideContentProps) =>
  renderContent(parseContent(content, { assetsPrefix }), React, components);

export default GuideContent;
