'use client';
import { translations } from '@/_contents/translations';
import { PersonOutline } from '@mui/icons-material';
import { Button, Stack, Hidden, Typography } from '@mui/material';
import { Auth, Hub } from 'aws-amplify';
import { FC, useCallback, useEffect, useState } from 'react';
import { DevPortalUser } from '@/lib/types/auth';

const UserInfo: FC = () => {
  const {
    auth: { logout },
  } = translations;
  const [user, setUser] = useState<DevPortalUser | null>(null);

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
      switch (event.payload.event) {
        case 'signIn':
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
      gap={1}
      justifyContent='flex-end'
    >
      <Hidden smDown>
        <PersonOutline />
        <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '14px' }}>
          {user.attributes.given_name} {user.attributes.family_name}
        </Typography>
      </Hidden>
      <Button
        size='small'
        variant='contained'
        onClick={signOut}
        sx={{ height: '30px' }}
      >
        {logout}
      </Button>
    </Stack>
  );
};

export default UserInfo;
