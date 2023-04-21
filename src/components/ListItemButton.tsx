import { ListItemButton as MUIListItemButton } from '@mui/material';
import ListItemText from '@/components/ListItemText';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import * as React from 'react';

type Props = {
  text: string;
  isCurrent: boolean;
  href: string;
  hasChildren?: boolean;
  onClick?: () => void;
  collapseOpen?: boolean;
};

const renderSingleItemButton = (props: Props) => (
  <MUIListItemButton>
    <ListItemText {...props} />
  </MUIListItemButton>
);

const renderItemWithChildren = (props: Props) => (
  <MUIListItemButton onClick={props.onClick}>
    <ListItemText {...props} />
    {props.collapseOpen ? <ExpandLess /> : <ExpandMore />}
  </MUIListItemButton>
);

export const ListItemButton = (props: Props) =>
  props.hasChildren
    ? renderItemWithChildren(props)
    : renderSingleItemButton(props);

export default ListItemButton;
