'use client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button, Stack, Hidden, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Link from 'next/link';
import { FC } from 'react';
import { translations } from '@/_contents/translations';

const UserInfo: FC = () => {
  const { shared } = translations;
  const { signOut, user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  if (authStatus !== 'authenticated') {
    return (
      <Stack
        flexGrow={1}
        alignItems='center'
        direction='row'
        gap={2}
        justifyContent='flex-end'
      >
        <Link href='/auth/login'>
          <Typography
            variant='caption-semibold'
            display='flex'
            alignItems='center'
            sx={{ textDecoration: 'none' }}
          >
            {shared.login} <LoginIcon sx={{ marginLeft: 1 }} />
          </Typography>
        </Link>
      </Stack>
    );
  }

  return (
    <Stack
      flexGrow={1}
      alignItems='center'
      direction='row'
      gap={2}
      justifyContent='flex-end'
    >
      <Hidden smDown>
        <Typography variant='body2'>Hello {user?.attributes?.email}</Typography>
      </Hidden>
      <Button size='small' variant='contained' onClick={signOut}>
        {shared.logout}
      </Button>
    </Stack>
  );
};

export default UserInfo;
