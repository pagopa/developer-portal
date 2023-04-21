import { ListItemButton as MUIListItemButton } from '@mui/material';
import ListItemText from '@/components/ListItemText';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

type SingleElementProps = {
  kind: 'single';
  text: string;
  isCurrent: boolean;
  href: string;
};

type ElementWithChildrenProps = {
  kind: 'withChildren';
  text: string;
  isCurrent: boolean;
  href: string;
  onClick: () => void;
  collapseOpen: boolean;
};

type Props = SingleElementProps | ElementWithChildrenProps;

const renderSingleItemButton = (props: SingleElementProps) => (
  <MUIListItemButton>
    <ListItemText {...props} />
  </MUIListItemButton>
);

const renderItemWithChildren = (props: ElementWithChildrenProps) => (
  <MUIListItemButton onClick={props.onClick}>
    <ListItemText {...props} />
    {props.collapseOpen ? <ExpandLess /> : <ExpandMore />}
  </MUIListItemButton>
);

export const ListItemButton = (props: Props) =>
  props.kind === 'withChildren'
    ? renderItemWithChildren(props)
    : renderSingleItemButton(props);

export default ListItemButton;
