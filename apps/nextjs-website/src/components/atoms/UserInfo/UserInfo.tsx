'use client';
import { Login, Logout } from '@mui/icons-material';
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
import { useRouter, usePathname } from 'next/navigation';

const UserInfo: FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const open = Boolean(menu);

  const { palette } = useTheme();

  const handleClose = () => {
    setMenu(null);
  };

  const signOut = useCallback(async () => {
    await Auth.signOut();

    // Check if the user in an auth only page
    if (['/auth', '/profile'].some((path) => pathname.match(path))) {
      router.replace('/');
    }

    handleClose();
  }, [pathname, router]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenu(event.currentTarget);
  }, []);

  return (
    <Stack
      flexGrow={1}
      alignItems='center'
      direction='row'
      gap={1}
      justifyContent='flex-end'
    >
      {!user && !loading && (
        <MuiLink
          href='/auth/login'
          component={Link}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: palette.text.primary,
          }}
        >
          <Typography
            variant='body1'
            sx={{ fontSize: '14px', fontWeight: 600 }}
          >
            {t('auth.login.action')}
          </Typography>{' '}
          <Login sx={{ marginLeft: '2px', height: 20, width: 18 }} />
        </MuiLink>
      )}
      {user && (
        <>
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
            <MenuItem
              onClick={handleClose}
              sx={{ flexDirection: 'column', p: 0 }}
            >
              <MuiLink
                component={Link}
                href='/profile/personal-data'
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
        </>
      )}
    </Stack>
  );
};

export default UserInfo;
