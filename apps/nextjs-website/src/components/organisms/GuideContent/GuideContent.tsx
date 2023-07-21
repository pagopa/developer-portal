import { parseContent } from 'gitbook-docs/parseContent';
import { RenderingComponents, renderContent } from 'gitbook-docs/renderContent';
import React, { ReactNode } from 'react';

type GuideContentProps = {
  assetsPrefix: string;
  content: string;
};

const components: RenderingComponents<ReactNode> = {
  StyledText: ({ style, children }) => (
    <div>
      TODO: render styled-text {style} {children}
    </div>
  ),
  Swagger: ({ src }) => <div>TODO: render Swagger element {src}</div>,
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  Hint: ({ children }) => <div>TODO: render Hint {children}</div>,
  CodeBlock: ({ children }) => <div>TODO: render code block {children}</div>,
  Image: ({ src }) => <div>TODO: render Figure {src}</div>,
  Paragraph: ({ children }) => <div>TODO: render Paragraph {children}</div>,
  Heading: ({ level, children }) => (
    <div>
      H{level} {children}
    </div>
  ),
  List: ({ children, ordered }) =>
    ordered ? <ol>{children}</ol> : <ul>{children}</ul>,
  Item: ({ children, checked }) =>
    checked === undefined ? (
      <li>{children}</li>
    ) : (
      <li className={'checkable'}>{children}</li>
    ),
};

const GuideContent = ({ content, assetsPrefix }: GuideContentProps) =>
  renderContent(parseContent(content, { assetsPrefix }), React, components);

export default GuideContent;
