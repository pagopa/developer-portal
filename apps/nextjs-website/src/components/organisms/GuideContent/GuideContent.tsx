import { parseContent } from 'gitbook-docs/parseContent';
import { RenderingComponents, renderContent } from 'gitbook-docs/renderContent';
import React, { ReactNode } from 'react';
import Heading from './components/Heading';
import Paragraph from './components/Paragraph';
import Hint from './components/Hint';
import List from './components/List';
import Item from './components/Item';

type GuideContentProps = {
  assetsPrefix: string;
  pagePath: string;
  isPageIndex: boolean;
  content: string;
};

const components: RenderingComponents<ReactNode> = {
  StyledText: ({ style, children }) => <></>,
  Swagger: ({ src }) => <div>TODO: render Swagger element {src}</div>,
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  Hint: Hint,
  Quote: ({ children }) => <div>TODO: render Quote {children}</div>,
  CodeBlock: ({ children }) => <div>TODO: render code block {children}</div>,
  Image: ({ src }) => <div>TODO: render Figure {src}</div>,
  Embed: ({ url }) => <a href={url} />,
  File: ({ src }) => <div>TODO: render File {src}</div>,
  Paragraph: Paragraph,
  Heading: Heading,
  List: List,
  Item: Item,
  Tabs: ({ children }) => <div>TODO: render Tabs</div>,
  Tab: ({ children }) => <div>TODO: rebder Tab</div>,
  Expandable: ({ children }) => <div className={'expandable'}>{children}</div>,
  ExpandableSummary: ({ children }) => <></>,
  ExpandableDetails: ({ children }) => <></>,
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
