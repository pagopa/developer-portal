'use client';
import React, { useCallback, useState } from 'react';
import {
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { Stack } from '@mui/system';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { profileMenuItems } from '@/config';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import Link from 'next/link';

type MobileProfileMenuProps = {
  userFullName: string | null;
};

const MobileProfileMenu = ({ userFullName }: MobileProfileMenuProps) => {
  const { palette } = useTheme();
  const t = useTranslations('profile');

  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const open = Boolean(menu);

  const handleClose = () => {
    setMenu(null);
  };

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenu(event.currentTarget);
  }, []);

  return (
    <Stack
      sx={{
        display: { md: 'none' },
        backgroundColor: palette.grey[50],
        position: 'relative',
      }}
      flexGrow={1}
      alignItems='center'
      direction='row'
      gap={1}
      justifyContent='flex-start'
    >
      <EContainer>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='flex-start'
          onClick={handleClick}
          sx={{ padding: 3 }}
        >
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {userFullName}
          </Typography>
          <IconButton size='small' sx={{ ml: 1 }}>
            <ArrowDropDownOutlinedIcon
              sx={{ width: 24, height: 24 }}
            ></ArrowDropDownOutlinedIcon>
          </IconButton>
        </Stack>
      </EContainer>

      <Menu
        anchorEl={menu}
        id='profile-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          ml: 1,
        }}
      >
        {profileMenuItems.map(
          ({ label, href }: { label: string; href: string }, index: number) => (
            <MenuItem
              key={index}
              onClick={handleClose}
              sx={{ flexDirection: 'column', p: 0 }}
            >
              <MuiLink
                component={Link}
                href={href}
                sx={{
                  alignSelf: 'stretch',
                  textDecoration: 'none',
                  color: palette.text.primary,
                  p: 2,
                }}
              >
                {t(label)}
              </MuiLink>
            </MenuItem>
          )
        )}
      </Menu>
    </Stack>
  );
};

export default MobileProfileMenu;
