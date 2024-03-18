'use client';
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
import Quote from './components/Quote';
import Embed from './components/Embed';
import CodeBlock from './components/CodeBlock';
import Swagger from './components/Swagger/Swagger';
import PageLink from '@/components/organisms/GitBookContent/components/PageLink';
import Cards, { Card, CardItem } from './components/Cards';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import SwaggerParameter from './components/Swagger/SwaggerParameter';
import SwaggerResponse from './components/Swagger/SwaggerResponse';
import SwaggerDescription from './components/Swagger/SwaggerDescription';

type GitBookContentProps = {
  content: string;
  config: ParseContentConfig;
};

const components: RenderingComponents<ReactNode> = {
  StyledText: StyledText,
  Swagger: Swagger,
  SwaggerParameter: SwaggerParameter,
  SwaggerResponse: SwaggerResponse,
  SwaggerDescription: SwaggerDescription,
  Link: Link,
  Hint: Hint,
  Quote: Quote,
  CodeBlock: CodeBlock,
  Image: Image,
  Embed: Embed,
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
  Cards: Cards,
  Card: Card,
  CardItem: CardItem,
  PageLink: PageLink,
  Br: () => <br />,
};

const GitBookContent = ({ content, config }: GitBookContentProps) =>
  renderContent(parseContent(content, config), React, components);

export default GitBookContent;
