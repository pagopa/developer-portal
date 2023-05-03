import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import MUIMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Menu } from '@/domain/navigator';
import React from 'react';
import Link from 'next/link';
import { theme } from '@/pages/_app';

type ProductGuideVersionsMenuProps = {
  versionsMenu: Menu;
};

const ProductGuideVersionsMenu = ({
  versionsMenu,
}: ProductGuideVersionsMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selected, setSelected] = React.useState<null | Menu[0]>(
    versionsMenu[0] || null
  );
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuItemClick = (item: Menu[0]) => () => {
    setSelected(item);
    setAnchorEl(null);
  };

  return (
    <Box>
      <List>
        <ListItemButton onClick={handleClickListItem}>
          <Typography color='text.secondary' variant='body2'>
            Versione {selected?.name}
          </Typography>
          {!open && (
            <ExpandMoreIcon
              fontSize='small'
              style={{ color: theme.palette.text.secondary }}
            />
          )}
          {open && (
            <ExpandLessIcon
              fontSize='small'
              style={{ color: theme.palette.text.secondary }}
            />
          )}
        </ListItemButton>
      </List>
      <MUIMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {versionsMenu.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            href={item.path}
            onClick={handleMenuItemClick(item)}
            selected={item === selected}
          >
            Versione {item.name}
          </MenuItem>
        ))}
      </MUIMenu>
    </Box>
  );
};

export default ProductGuideVersionsMenu;
