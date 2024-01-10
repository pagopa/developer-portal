'use client';
import LoginForm from '@/components/organisms/Auth/LoginForm';
import ConfirmLogIn from '@/components/organisms/Auth/ConfirmLogin';
import { Box, Grid } from '@mui/material';
import { useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';
import { LoginSteps } from '@/lib/types/loginSteps';
import { LoginFunction } from '@/lib/types/loginFunction';
import { useRouter, useSearchParams } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [logInStep, setLogInStep] = useState(LoginSteps.LOG_IN);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalidCode, setInvalidCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onLogin: LoginFunction = useCallback(async ({ username, password }) => {
    setUsername(username);
    setPassword(password);

    const user = await Auth.signIn(username, password).catch((e) => {
      return new Error(e);
    });

    if (user) {
      setUser(user);

      setLogInStep(LoginSteps.MFA_CHALLENGE);
      setInvalidCode(false);
    }

    return !!user;
  }, []);
  const searchParams = useSearchParams();

  const resendCode = useCallback(async () => {
    return onLogin({ username, password }).finally(() => {
      setInvalidCode(false);
      setSubmitting(false);
    });
  }, [onLogin, password, username]);

  const confirmLogin = useCallback(
    async (code: string) => {
      const result = await Auth.sendCustomChallengeAnswer(user, code).catch(
        () => {
          setInvalidCode(true);
          return false;
        }
      );

      if (result) {
        const redirect = searchParams.get('redirect');
        router.replace(redirect ? redirect : '/');
      }
    },
    [router, searchParams, user]
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
          <ConfirmLogIn
            invalidCode={invalidCode}
            username={username}
            onResendCode={resendCode}
            onConfirmLogin={confirmLogin}
            submitting={submitting}
            setSubmitting={setSubmitting}
          />
        )}
      </Grid>
    </Box>
  );
};

export default Login;
