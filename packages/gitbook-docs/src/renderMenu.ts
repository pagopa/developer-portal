import Markdoc, { RenderableTreeNode } from '@markdoc/markdoc';
import type { ReactNode } from 'react';
import { LinkProps } from './markdoc/schema/link';
import { ReactShape } from './ReactShape';
import { TitleProps } from './markdoc/schema/title';
import { MenuItemProps } from './markdoc/schema/menuItem';
import { MenuListProps } from './markdoc/schema/menuList';

export type RenderingComponents<A> = {
  readonly Title: (props: TitleProps<A>) => A;
  readonly List: (props: MenuListProps<A>) => A;
  readonly Item: (props: MenuItemProps<A>) => A;
  readonly Link: (props: LinkProps<A>) => A;
};

export const renderMenu = (
  node: RenderableTreeNode,
  React: ReactShape,
  components: RenderingComponents<ReactNode>
): ReactNode => Markdoc.renderers.react(node, React, { components });
