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
  menuAnchorOrigin?: PopoverOrigin;
  menuTransformOrigin?: PopoverOrigin;
};

const Dropdown = ({
  label,
  items,
  icons,
  buttonStyle,
  menuStyle,
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
        sx={buttonStyle}
      >
        {label}
      </Button>
      <Menu
        elevation={0}
        anchorOrigin={
          menuAnchorOrigin || {
            vertical: 'bottom',
            horizontal: 'right',
          }
        }
        transformOrigin={
          menuTransformOrigin || {
            vertical: 'top',
            horizontal: 'center',
          }
        }
        MenuListProps={{
          'aria-labelledby': `${label}-button`,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={menuStyle}
      >
        {items.map((item, index) => {
          return (
            <MenuItem key={index} onClick={handleClose} disableRipple>
              <Button
                style={{ justifyContent: 'flex-start' }}
                fullWidth={true}
                size='medium'
                component={Link}
                aria-label={item.label}
                href={item.href}
                title={item.label}
              >
                {item.label}
              </Button>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default Dropdown;
