import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import type { ReactNode } from 'react';
import { ReactShape } from './ReactShape';
import { TitleProps } from './markdoc/schema/title';
import { MenuItemProps } from './markdoc/schema/menu';

export type RenderingComponents<A> = {
  readonly Title: (props: TitleProps<A>) => A;
  readonly Item: (props: MenuItemProps<A>) => A;
};

export const renderMenu = (
  node: RenderableTreeNode,
  React: ReactShape,
  components: RenderingComponents<ReactNode>
): ReactNode => Markdoc.renderers.react(node, React, { components });
