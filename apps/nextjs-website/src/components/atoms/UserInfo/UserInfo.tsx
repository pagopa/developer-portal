'use client';
import { PersonOutline } from '@mui/icons-material';
import { Button, Stack, Hidden, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { FC, useCallback, useEffect, useState } from 'react';

const UserInfo: FC = () => {
  const [user, setUser] = useState<any>(null);

  const checkUser = useCallback(async () => {
    const user = await Auth.currentAuthenticatedUser().catch(() => null);

    setUser(user);
  }, []);

  useEffect(() => {
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, []);

  const signOut = useCallback(async () => {
    await Auth.signOut();
    checkUser();
  }, [checkUser]);

  if (!user) {
    return null;
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
        <PersonOutline />
        <Typography variant='body2'>
          {user?.attributes?.given_name} {user?.attributes?.family_name}
        </Typography>
      </Hidden>
      <Button size='small' variant='contained' onClick={signOut}>
        Sign out
      </Button>
    </Stack>
  );
};

export default UserInfo;
