'use client';
import { Logout } from '@mui/icons-material';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import {
  Stack,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  Link as MuiLink,
} from '@mui/material';
import { Auth } from 'aws-amplify';
import { FC, useCallback, useState } from 'react';
import { useUser } from '@/helpers/user.helper';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const UserInfo: FC = () => {
  const t = useTranslations();
  const { user } = useUser();
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const open = Boolean(menu);

  const { palette } = useTheme();

  const handleClose = () => {
    setMenu(null);
  };

  const signOut = useCallback(async () => {
    await Auth.signOut();

    handleClose();
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenu(event.currentTarget);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <Stack
      flexGrow={1}
      alignItems='center'
      direction='row'
      gap={1}
      justifyContent='flex-end'
    >
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='flex-end'
        onClick={handleClick}
      >
        <Avatar
          sx={{
            width: 20,
            height: 20,
            mr: 1,
            bgcolor: palette.text.primary,
          }}
        ></Avatar>
        <Typography variant='body2' sx={{ fontSize: 14, fontWeight: 600 }}>
          {user.attributes.given_name} {user.attributes.family_name}
        </Typography>
        <IconButton size='small' sx={{ ml: 1 }}>
          <ArrowDropDownOutlinedIcon
            sx={{ width: 24, height: 24 }}
          ></ArrowDropDownOutlinedIcon>
        </IconButton>
      </Stack>

      <Menu
        anchorEl={menu}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
        }}
      >
        <MenuItem onClick={handleClose} sx={{ flexDirection: 'column', p: 0 }}>
          <MuiLink
            component={Link}
            href='profile/personal-data'
            sx={{
              alignSelf: 'stretch',
              textDecoration: 'none',
              color: palette.text.primary,
              p: 2,
            }}
          >
            {t('shared.yourData')}
          </MuiLink>
        </MenuItem>
        <MenuItem onClick={signOut} sx={{ p: 2 }}>
          {t('auth.logout')}
          <ListItemIcon sx={{ ml: 1 }}>
            <Logout fontSize='small' sx={{ color: palette.text.primary }} />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default UserInfo;
