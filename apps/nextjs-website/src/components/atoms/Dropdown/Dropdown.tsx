'use client';
import React, { ReactNode, useMemo } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import { PaperProps, PopoverOrigin, SxProps } from '@mui/material';

type DropdownProps = {
  label: string;
  items: { href: string; label: string }[];
  icons?: { opened?: ReactNode; closed?: ReactNode };
  buttonStyle?: SxProps;
  menuStyle?: Partial<PaperProps>;
  menuItemStyle?: SxProps;
  menuAnchorOrigin?: PopoverOrigin;
  menuTransformOrigin?: PopoverOrigin;
};

const Dropdown = ({
  label,
  items,
  icons,
  buttonStyle,
  menuStyle,
  menuItemStyle,
  menuAnchorOrigin,
  menuTransformOrigin,
}: DropdownProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls={open ? `${label}-menu` : undefined}
        aria-expanded={open ? 'true' : undefined}
        variant='text'
        disableElevation
        onClick={handleClick}
        endIcon={
          open
            ? icons?.opened || <ArrowDropUp />
            : icons?.closed || <ArrowDropDown />
        }
        sx={{ margin: 0, padding: 0, ...buttonStyle }}
      >
        {label}
      </Button>
      <Menu
        elevation={8}
        anchorOrigin={
          menuAnchorOrigin || {
            vertical: 'bottom',
            horizontal: 'left',
          }
        }
        transformOrigin={
          menuTransformOrigin || {
            vertical: 'top',
            horizontal: 'left',
          }
        }
        MenuListProps={{
          'aria-labelledby': `${label}-button`,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          ...menuStyle,
          sx: {
            borderRadius: 2,
            marginTop: 1,
            ...menuStyle?.sx,
          },
        }}
      >
        {items.map((item, index) => {
          return (
            <MenuItem
              key={index}
              onClick={handleClose}
              disableRipple
              component={Link}
              href={item.href}
              sx={{
                color: 'text.primary',
                fontSize: '16px',
                paddingY: 1,
                justifyContent: 'flex-start',
                ...menuItemStyle,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default Dropdown;
