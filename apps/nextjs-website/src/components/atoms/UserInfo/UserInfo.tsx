'use client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button, Stack, Hidden, Typography } from '@mui/material';
import { FC } from 'react';

const UserInfo: FC = () => {
  const { signOut, user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  const showUserInfo = authStatus === 'authenticated';

  if (!showUserInfo) {
    return null;
  }

  return (
    <Stack
      flexGrow={1}
      spacing={2}
      direction='row'
      justifyContent={{ sm: 'space-between', md: 'end' }}
      alignItems='center'
    >
      <Hidden smDown>
        <Typography variant='body2'>Hello {user?.attributes?.email}</Typography>
      </Hidden>
      <Button size='small' variant='contained' onClick={signOut}>
        Sign out
      </Button>
    </Stack>
  );
};

export default UserInfo;
