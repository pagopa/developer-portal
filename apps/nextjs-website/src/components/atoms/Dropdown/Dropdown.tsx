import React, { Fragment } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { ArrowDropDown } from '@mui/icons-material';
import { ButtonNaked } from '@pagopa/mui-italia';

type DropdownProps = {
  label: string;
  items: { href: string; label: string }[];
};

const Dropdown = ({ label, items }: DropdownProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Button
        aria-controls={open ? `${label}-menu` : undefined}
        aria-expanded={open ? 'true' : undefined}
        variant='naked'
        disableElevation
        onClick={handleClick}
        endIcon={<ArrowDropDown />}
      >
        {label}
      </Button>
      <Menu
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{
          'aria-labelledby': `${label}-button`,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {items.map((item, index) => {
          return (
            <MenuItem key={index} onClick={handleClose} disableRipple>
              <ButtonNaked
                style={{ justifyContent: 'flex-start' }}
                fullWidth={true}
                size={'medium'}
                weight={'light'}
                component={Link}
                aria-label={item.label}
                href={item.href}
                title={item.label}
              >
                {item.label}
              </ButtonNaked>
            </MenuItem>
          );
        })}
      </Menu>
    </Fragment>
  );
};

export default Dropdown;
