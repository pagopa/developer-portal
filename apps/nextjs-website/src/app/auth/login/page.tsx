'use client';
import LoginForm from '@/components/organisms/Auth/LoginForm';
import ConfirmLogIn from '@/components/organisms/Auth/ConfirmLogin';
import { Box, Grid } from '@mui/material';
import { useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';
import { LoginSteps } from '@/lib/types/loginSteps';
import { LoginFunction } from '@/lib/types/loginFunction';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [logInStep, setLogInStep] = useState(LoginSteps.LOG_IN);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState<string | null>(null);

  const onLogin: LoginFunction = useCallback(async ({ username, password }) => {
    const user = await Auth.signIn({
      username,
      password,
    });

    setUserName(username);
    setUser(user);
    setLogInStep(LoginSteps.MFA_CHALLENGE);
  }, []);

  const confirmLogin = useCallback(
    async (code: string) => {
      await Auth.sendCustomChallengeAnswer(user, code);

      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      router.replace(redirect ? redirect : '/');
    },
    [router, user]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      <Grid
        container
        justifyContent='center'
        sx={{ mx: 'auto' }}
        my={6}
        spacing={6}
      >
        {logInStep === LoginSteps.LOG_IN && <LoginForm onLogin={onLogin} />}
        {logInStep === LoginSteps.MFA_CHALLENGE && (
          <ConfirmLogIn email={userName} onConfirmLogin={confirmLogin} />
        )}
      </Grid>
    </Box>
  );
};

export default Login;
