'use client';
import { PersonOutline } from '@mui/icons-material';
import { Button, Stack, Hidden, Typography } from '@mui/material';
import { Auth, Hub } from 'aws-amplify';
import { FC, useCallback, useEffect, useState } from 'react';

const UserInfo: FC = () => {
  const [user, setUser] = useState<any>(null);

  const checkUser = useCallback(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setUser(user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const cancel = Hub.listen('auth', (event) => {
      console.log(event.payload.event);
      switch (event.payload.event) {
        case 'signIn': {
          const { data: user } = event.payload;
          setUser(user);
          break;
        }
        case 'autoSignIn': {
          const { data: user } = event.payload;
          setUser(user);
          break;
        }
        case 'signOut':
          setUser(null);
          break;
      }
    });

    return () => cancel();
  }, []);

  const signOut = useCallback(async () => {
    await Auth.signOut();
  }, []);

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
