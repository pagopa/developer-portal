'use client';
import { Login, Logout, PersonOutline } from '@mui/icons-material';
import { Box, Link as MuiLink, Typography, useTheme } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { useCallback } from 'react';
import { useUser } from '@/helpers/user.helper';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { MobileSiteHeaderStyledTreeItem } from '@/components/molecules/MobileSiteHeader/MobileSiteHeader';
import { flushChatQueriesFromLocalStorage } from '@/helpers/chatbot.helper';

type MobileUserInfoProps = {
  // eslint-disable-next-line functional/no-return-void
  onClick?: () => void;
};

const MobileUserInfo = ({ onClick }: MobileUserInfoProps) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

  const { palette } = useTheme();

  const signOut = useCallback(async () => {
    if (onClick) onClick();
    await Auth.signOut().then(() => {
      flushChatQueriesFromLocalStorage();
    });

    // Check if the user in an auth only page
    if (['/auth', '/profile'].some((path) => pathname.match(path))) {
      router.replace('/');
    } else {
      // router.refresh(); is not enough beacuse it will not clean current state of components
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }, [pathname, router, onClick]);

  return (
    <>
      {!user && !loading && (
        <MuiLink
          href='/auth/login'
          component={Link}
          onClick={onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: palette.text.primary,
            marginBottom: 2,
          }}
        >
          <Typography
            variant='body1'
            sx={{
              color: palette.primary.dark,
              fontSize: 18,
              fontWeight: 600,
              display: 'flex',
              marginRight: 1,
            }}
          >
            {t('auth.login.action')}
          </Typography>
          <Login
            sx={{
              color: palette.primary.dark,
              height: 20,
              width: 18,
            }}
          />
        </MuiLink>
      )}
      {user && (
        <MobileSiteHeaderStyledTreeItem
          itemId={'siteHeader.userInfo'}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonOutline
                sx={{
                  width: 20,
                  height: 20,
                  color: palette.primary.dark,
                  marginRight: 1,
                }}
              ></PersonOutline>
              <Typography
                variant='body2'
                noWrap
                sx={{
                  maxWidth: '200px',
                  color: palette.primary.dark,
                  fontSize: 18,
                  fontWeight: 600,
                  display: 'block',
                }}
              >
                {user.attributes.given_name} {user.attributes.family_name}
              </Typography>
            </Box>
          }
        >
          <Typography
            variant='body1'
            component={Link}
            onClick={onClick}
            href={'/profile/personal-data'}
            style={{
              color: palette.primary.dark,
              display: 'block',
              textDecoration: 'none',
            }}
          >
            {t('shared.yourData')}
          </Typography>
          <MuiLink
            href='/auth/login'
            component={Link}
            onClick={signOut}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: palette.text.primary,
              justifyContent: 'start',
            }}
          >
            <Typography
              variant='body1'
              sx={{
                color: palette.primary.dark,
                fontSize: '18px',
                fontWeight: 400,
                display: 'flex',
                marginRight: 1,
              }}
            >
              {t('auth.logout')}
            </Typography>
            <Logout fontSize='small' sx={{ color: palette.primary.dark }} />
          </MuiLink>
        </MobileSiteHeaderStyledTreeItem>
      )}
    </>
  );
};

export default MobileUserInfo;
