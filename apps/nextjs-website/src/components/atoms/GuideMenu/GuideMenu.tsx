import Markdoc from '@markdoc/markdoc';
import { parseMenu } from 'gitbook-docs/parseMenu';
import React, { ReactNode } from 'react';

type GuideMenuProps = {
  linkPrefix: string;
  assetsPrefix: string;
  menu: string;
};

type LinkProps = {
  href: string;
  title?: string;
  children: ReactNode;
};

type ItemProps = {
  isLeaf: boolean;
  children: ReactNode;
};

type ListProps = {
  children: ReactNode;
};

type TitleProps = {
  children: ReactNode;
};

const components = {
  Link: ({ href, children }: LinkProps) => <a href={href}>{children}</a>,
  Item: ({ isLeaf, children }: ItemProps) => (
    <li className={isLeaf ? 'leaf' : 'node'}>{children}</li>
  ),
  List: ({ children }: ListProps) => <ul>{children}</ul>,
  Title: ({ children }: TitleProps) => <h2>{children}</h2>,
};

const GuideMenu = ({ menu, assetsPrefix, linkPrefix }: GuideMenuProps) => (
  Markdoc.renderers.react(
    parseMenu(menu, { assetsPrefix, linkPrefix }),
    React,
    { components }
  );
);

export default GuideMenu;
