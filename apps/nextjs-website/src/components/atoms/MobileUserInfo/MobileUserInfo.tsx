'use client';
import { Login, Logout, PersonOutline } from '@mui/icons-material';
import { Box, Link as MuiLink, Typography, useTheme } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { useCallback } from 'react';
import { useUser } from '@/helpers/user.helper';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { MobileSiteHeaderStyledTreeItem } from '@/components/molecules/MobileSiteHeader/MobileSiteHeader';
import { flushChatQueriesFromLocalStorage } from '@/helpers/chatbot.helpers';
import { shouldRedirectAfterLogout } from '@/helpers/navigation.helpers';

type MobileUserInfoProps = {
  // eslint-disable-next-line functional/no-return-void
  onClick?: () => void;
};

const MobileUserInfo = ({ onClick }: MobileUserInfoProps) => {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations();
  const router = useRouter();
  const { user, loading, setIsLoggingOut } = useUser();

  const { palette } = useTheme();

  const signOut = useCallback(async () => {
    if (onClick) onClick();
    setIsLoggingOut(true);
    const result = await Auth.signOut()
      .then(() => true)
      .catch(() => {
        setIsLoggingOut(false);
        return false;
      });

    if (!result) {
      return;
    }

    // eslint-disable-next-line functional/no-try-statements
    try {
      flushChatQueriesFromLocalStorage();
    } catch {
      console.warn('Could not clear local chatbot history after logout.');
    }

    // Choose the destination from the current page after sign-out completes.
    if (shouldRedirectAfterLogout(window.location.pathname)) {
      router.replace(`/${locale}/`);
    } else {
      // Reload the current public page to clear component state.
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }, [router, onClick, locale, setIsLoggingOut]);

  return (
    <>
      {!user && !loading && (
        <MuiLink
          href={`/${locale}/auth/login`}
          component={Link}
          onClick={onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: palette.text.primary,
            marginBottom: 4,
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
            href={`/${locale}/profile/personal-data`}
            style={{
              color: palette.primary.dark,
              display: 'block',
              textDecoration: 'none',
            }}
          >
            {t('shared.yourData')}
          </Typography>
          <MuiLink
            component={'button'}
            onClick={signOut}
            type='button'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: palette.text.primary,
              justifyContent: 'start',
              marginBottom: '8px !important',
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
