import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import type { ReactNode } from 'react';
import { ReactShape } from './ReactShape';
import { SwaggerProps } from './markdoc/schema/swagger';
import { LinkProps } from './markdoc/schema/link';
import { HintProps } from './markdoc/schema/hint';
import { ImageProps } from './markdoc/schema/image';
import { ParagraphProps } from './markdoc/schema/paragraph';
import { HeadingProps } from './markdoc/schema/heading';
import { ListProps } from './markdoc/schema/list';
import { ItemProps } from './markdoc/schema/item';
import { CodeBlockProps } from './markdoc/schema/code';
import { FileProps } from './markdoc/schema/file';
import { StyledTextProps } from './markdoc/schema/styledText';
import { QuoteProps } from './markdoc/schema/blockquote';
import { TabsProps } from './markdoc/schema/tabs';
import { EmbedProps } from './markdoc/schema/embed';
import {
  ExpandableDetailsProps,
  ExpandableProps,
  ExpandableSummaryProps,
} from './markdoc/schema/details';
import {
  TableBodyProps,
  TableDProps,
  TableHProps,
  TableHeadProps,
  TableProps,
  TableRProps,
} from './markdoc/schema/table';
import { PageLinkProps } from './markdoc/schema/pageLink';

export type RenderingComponents<A> = {
  readonly Link: (props: LinkProps<A>) => A;
  readonly StyledText: (props: StyledTextProps) => A;
  readonly Paragraph: (props: ParagraphProps<A>) => A;
  readonly Heading: (props: HeadingProps<A>) => A;
  readonly List: (props: ListProps<A>) => A;
  readonly Item: (props: ItemProps<A>) => A;
  readonly Hint: (props: HintProps<A>) => A;
  readonly Quote: (props: QuoteProps<A>) => A;
  readonly CodeBlock: (props: CodeBlockProps<A>) => A;
  readonly File: (props: FileProps) => A;
  readonly Image: (props: ImageProps) => A;
  readonly Embed: (props: EmbedProps<A>) => A;
  readonly Table: (props: TableProps<A>) => A;
  readonly TableHead: (props: TableHeadProps<A>) => A;
  readonly TableBody: (props: TableBodyProps<A>) => A;
  readonly TableH: (props: TableHProps<A>) => A;
  readonly TableR: (props: TableRProps<A>) => A;
  readonly TableD: (props: TableDProps<A>) => A;
  // readonly Cards: (props: CardsProps<A>) => A;
  readonly Tabs: (props: TabsProps<A>) => A;
  readonly Expandable: (props: ExpandableProps<A>) => A;
  readonly ExpandableSummary: (props: ExpandableSummaryProps<A>) => A;
  readonly ExpandableDetails: (props: ExpandableDetailsProps<A>) => A;
  readonly Swagger: (props: SwaggerProps) => A;
  readonly PageLink: (props: PageLinkProps<A>) => A;
};

export const renderContent = (
  node: ReadonlyArray<RenderableTreeNode>,
  React: ReactShape,
  components: RenderingComponents<ReactNode>
): ReactNode => Markdoc.renderers.react([...node], React, { components });
