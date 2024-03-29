import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import type { ReactNode } from 'react';
import { ReactShape } from './ReactShape';
import { HeadingProps } from './markdoc/schema/heading';

export type RenderingComponents<A> = {
  readonly Heading: (props: HeadingProps<A>) => A;
};

export const renderInPageMenu = (
  nodes: ReadonlyArray<RenderableTreeNode>,
  React: ReactShape,
  components: RenderingComponents<ReactNode>
): ReactNode => Markdoc.renderers.react([...nodes], React, { components });
