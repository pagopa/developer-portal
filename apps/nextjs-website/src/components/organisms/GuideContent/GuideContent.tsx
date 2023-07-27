import { parseContent } from 'gitbook-docs/parseContent';
import { RenderingComponents, renderContent } from 'gitbook-docs/renderContent';
import React, { ReactNode } from 'react';
import Table, {
  TableBody,
  TableD,
  TableH,
  TableHead,
  TableR,
} from './components/Table';
import Heading from './components/Heading';
import Paragraph from './components/Paragraph';
import Hint from './components/Hint';
import List from './components/List';
import Item from './components/Item';
import Link from './components/Link';
import StyledText from './components/StyledText';
import File from './components/File';
import Image from './components/Image';
import Expandable, {
  ExpandableDetails,
  ExpandableSummary,
} from './components/Expandable';
import Tabs from './components/Tabs';

type GuideContentProps = {
  assetsPrefix: string;
  pagePath: string;
  isPageIndex: boolean;
  content: string;
};

const components: RenderingComponents<ReactNode> = {
  StyledText: StyledText,
  Swagger: ({ src }) => <div>TODO: render Swagger element {src}</div>,
  Link: Link,
  Hint: Hint,
  Quote: ({ children }) => <div>TODO: render Quote {children}</div>,
  CodeBlock: ({ children }) => <div>TODO: render code block {children}</div>,
  Image: Image,
  Embed: ({ url }) => <div>TODO: embed</div>,
  File: File,
  Paragraph: Paragraph,
  Heading: Heading,
  List: List,
  Item: Item,
  Tabs: Tabs,
  Expandable: Expandable,
  ExpandableSummary: ExpandableSummary,
  ExpandableDetails: ExpandableDetails,
  Table: Table,
  TableHead: TableHead,
  TableBody: TableBody,
  TableH: TableH,
  TableR: TableR,
  TableD: TableD,
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
