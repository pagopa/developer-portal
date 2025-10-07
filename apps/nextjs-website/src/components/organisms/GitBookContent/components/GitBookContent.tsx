'use client';
import { parseContent, ParseContentConfig } from 'gitbook-docs/parseContent';
import { RenderingComponents, renderContent } from 'gitbook-docs/renderContent';
import React, { ReactNode } from 'react';
import Table, { TableBody, TableD, TableH, TableHead, TableR } from './Table';
import Heading, { HeadingIgnoreH1 } from './Heading';
import Paragraph from './Paragraph';
import Hint from './Hint';
import List from './List';
import Item from './Item';
import Link from './Link';
import StyledText from './StyledText';
import File from './File';
import Image from './Image';
import Expandable, { ExpandableDetails, ExpandableSummary } from './Expandable';
import Tabs from './Tabs';
import Quote from './Quote';
import Embed from './Embed';
import CodeBlock from './CodeBlock';
import Swagger from './Swagger/Swagger';
import Cards, { Card, CardItem } from './Cards';
import SwaggerParameter from './Swagger/SwaggerParameter';
import SwaggerResponse from './Swagger/SwaggerResponse';
import SwaggerDescription from './Swagger/SwaggerDescription';
import Steppers from './Steppers';
import Stepper from './Stepper';
import PageLink from '@/components/organisms/GitBookContent/components/PageLink';

type GitBookContentProps = {
  content: string;
  config: ParseContentConfig;
  hideH1?: boolean;
};

const hideH1Components: RenderingComponents<ReactNode> = {
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
  Heading: HeadingIgnoreH1,
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
  Stepper: Stepper,
  Steppers: Steppers,
  Br: () => <br />,
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
  Stepper: Stepper,
  Steppers: Steppers,
  Br: () => <br />,
};

const GitBookContent = ({
  content,
  config,
  hideH1 = false,
}: GitBookContentProps) =>
  renderContent(
    parseContent(content, config),
    React,
    hideH1 ? hideH1Components : components
  );

export default GitBookContent;
