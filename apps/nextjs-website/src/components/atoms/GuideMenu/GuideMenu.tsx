'use client';
import { parseMenu } from 'gitbook-docs/parseMenu';
import { RenderingComponents, renderMenu } from 'gitbook-docs/renderMenu';
import React, { ReactNode } from 'react';

type GuideMenuProps = {
  linkPrefix: string;
  assetsPrefix: string;
  menu: string;
};

const components: RenderingComponents<ReactNode> = {
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  Item: ({ isLeaf, children }) => (
    <li className={isLeaf ? 'leaf' : 'node'}>{children}</li>
  ),
  List: ({ children }) => <ul>{children}</ul>,
  Title: ({ children }) => <h2>{children}</h2>,
};

const GuideMenu = ({ menu, assetsPrefix, linkPrefix }: GuideMenuProps) =>
  renderMenu(parseMenu(menu, { assetsPrefix, linkPrefix }), React, components);

export default GuideMenu;
