'use client';
import { translations } from '@/_contents/translations';
import { PersonOutline } from '@mui/icons-material';
import { Button, Stack, Hidden, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { FC, useCallback } from 'react';
import { useUser } from '@/helpers/user.helper';

const UserInfo: FC = () => {
  const {
    auth: { logout },
  } = translations;
  const { user } = useUser();

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
