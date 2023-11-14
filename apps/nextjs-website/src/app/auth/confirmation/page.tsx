'use client';
import { Box, CircularProgress, Stack } from '@mui/material';
import { isProduction } from '@/config';
import PageNotFound from '@/app/not-found';
import { Auth } from 'aws-amplify';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Confirmation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get('username');
  const code = searchParams.get('code');

  const [renderNotFound, setRenderNotFound] = useState(isProduction);

  useEffect(() => {
    if (username && code) {
      Auth.confirmSignUp(username, code)
        .then(() => {
          setRenderNotFound(false);
          // eslint-disable-next-line functional/immutable-data
          router.push('/auth/account-activated');
        })
        .catch(() => {
          setRenderNotFound(true);
        });
    } else {
      setRenderNotFound(true);
    }
  }, [username, code]);

  return renderNotFound ? (
    <PageNotFound />
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Stack
        justifyContent={'center'}
        height={500}
        padding={2}
        alignItems='center'
      >
        <CircularProgress />
      </Stack>
    </Box>
  );
};

export default Confirmation;
