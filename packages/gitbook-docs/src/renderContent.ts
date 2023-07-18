import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import type { ReactNode } from 'react';
import { ReactShape } from './ReactShape';
import { SwaggerProps } from './markdoc/schema/swagger';
import { LinkProps } from './markdoc/schema/link';
import { HintProps } from './markdoc/schema/hint';
import { FigureProps } from './markdoc/schema/figure';
import { ParagraphProps } from './markdoc/schema/paragraph';

export type RenderingComponents<A> = {
  readonly Swagger: (props: SwaggerProps) => A;
  readonly Link: (props: LinkProps<A>) => A;
  readonly Hint: (props: HintProps<A>) => A;
  readonly Figure: (props: FigureProps<A>) => A;
  readonly Paragraph: (props: ParagraphProps<A>) => A;
};

export const renderContent = (
  node: RenderableTreeNode,
  React: ReactShape,
  components: RenderingComponents<ReactNode>
): ReactNode => Markdoc.renderers.react(node, React, { components });
