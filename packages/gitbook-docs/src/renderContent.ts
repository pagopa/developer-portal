import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import type { ReactNode } from 'react';
import { ReactShape } from './ReactShape';
import { SwaggerProps } from './markdoc/schema/swagger';
import { LinkProps } from './markdoc/schema/link';
import { HintProps } from './markdoc/schema/hint';
import { FigureProps } from './markdoc/schema/figure';
import { ParagraphProps } from './markdoc/schema/paragraph';
import { HeadingProps } from './markdoc/schema/heading';
import { CodeBlockProps } from './markdoc/schema/code';
import { FileProps } from './markdoc/schema/file';

export type RenderingComponents<A> = {
  readonly Link: (props: LinkProps<A>) => A;
  readonly Paragraph: (props: ParagraphProps<A>) => A;
  readonly Heading: (props: HeadingProps<A>) => A;
  // readonly UnorderList: (props: UnorderedListProps<A>) => A;
  // readonly OrderedList: (props: OrderedListProps<A>) => A;
  // readonly TaskList: (props: TaskListProps<A>) => A;
  readonly Hint: (props: HintProps<A>) => A;
  // readonly Quote: (props: QuoteProps<A>) => A;
  readonly CodeBlock: (props: CodeBlockProps<A>) => A;
  readonly File: (props: FileProps) => A;
  readonly Figure: (props: FigureProps<A>) => A;
  // readonly Embed: (props: EmbedProps<A>) => A;
  // readonly Table: (props: TableProps<A>) => A;
  // readonly Cards: (props: CardsProps<A>) => A;
  // readonly Tabs: (props: TabsProps<A>) => A;
  // readonly Expandable: (props: ExpandableProps<A>) => A;
  readonly Swagger: (props: SwaggerProps) => A;
  // readonly PageLink: (props: PageLinkProps<A>) => A;
};

export const renderContent = (
  node: RenderableTreeNode,
  React: ReactShape,
  components: RenderingComponents<ReactNode>
): ReactNode => Markdoc.renderers.react(node, React, { components });
