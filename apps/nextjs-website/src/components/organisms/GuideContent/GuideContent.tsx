import { parseContent } from 'gitbook-docs/parseContent';
import { RenderingComponents, renderContent } from 'gitbook-docs/renderContent';
import React, { ReactNode } from 'react';

type GuideContentProps = {
  assetsPrefix: string;
  pagePath: string;
  isPageIndex: boolean;
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
  Quote: ({ children }) => <div>TODO: render Quote {children}</div>,
  CodeBlock: ({ children }) => <div>TODO: render code block {children}</div>,
  Image: ({ src }) => <div>TODO: render Figure {src}</div>,
  Embed: ({ url }) => <a href={url} />,
  File: ({ src }) => <div>TODO: render File {src}</div>,
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
  Tabs: ({ children }) => <div>TODO: render Tabs</div>,
  Tab: ({ children }) => <div>TODO: rebder Tab</div>,
  Expandable: ({ children }) => <div className={'expandable'}>{children}</div>,
  ExpandableSummary: ({ children }) => (
    <div className={'summary'}>{children}</div>
  ),
  ExpandableDetails: ({ children }) => (
    <div className={'details'}>{children}</div>
  ),
  Table: ({ children }) => <table>{children}</table>,
  TableHead: ({ children }) => <thead>{children}</thead>,
  TableBody: ({ children }) => <tbody>{children}</tbody>,
  TableH: ({ children }) => <th>{children}</th>,
  TableR: ({ children }) => <tr>{children}</tr>,
  TableD: ({ children }) => <td>{children}</td>,
};

const GuideContent = ({
  content,
  assetsPrefix,
  pagePath,
  isPageIndex,
}: GuideContentProps) =>
  renderContent(
    parseContent(content, { assetsPrefix, pagePath, isPageIndex }),
    React,
    components
  );

export default GuideContent;
