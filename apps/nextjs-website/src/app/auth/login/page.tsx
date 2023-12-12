'use client';
import LoginForm from '@/components/organisms/Auth/LoginForm';
import ConfirmLogIn from '@/components/organisms/Auth/ConfirmLogin';
import { Alert, Box, Grid, Snackbar } from '@mui/material';
import { useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';
import { LoginSteps } from '@/lib/types/loginSteps';
import { LoginFunction } from '@/lib/types/loginFunction';
import { useRouter } from 'next/navigation';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import { snackbarAutoHideDurationMs } from '@/config';

const Login = () => {
  const router = useRouter();
  const [logInStep, setLogInStep] = useState(LoginSteps.LOG_IN);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onLogin: LoginFunction = useCallback(async ({ username, password }) => {
    const user = await Auth.signIn({
      username,
      password,
    }).catch((error) => {
      if (error.code === 'UserNotConfirmedException') {
        setUserName(username);
        setLogInStep(LoginSteps.CONFIRM_ACCOUNT);
      }

      setError(error.message);

      return false;
    });

    setUserName(username);

    if (user) {
      setUser(user);
      setLogInStep(LoginSteps.MFA_CHALLENGE);
    }
  }, []);

  const confirmLogin = useCallback(
    async (code: string) => {
      await Auth.sendCustomChallengeAnswer(user, code);

      router.replace('/');
    },
    [router, user]
  );

  const onBackStep = useCallback(() => {
    router.replace(
      `/auth/login?email=${encodeURIComponent(userName || '')}&step=${
        LoginSteps.LOG_IN
      }`
    );
    setLogInStep(LoginSteps.LOG_IN);
    return null;
  }, [router, userName]);

  return (
    <>
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
          {logInStep === LoginSteps.CONFIRM_ACCOUNT && (
            <ConfirmSignUp email={userName || ''} onBack={onBackStep} />
          )}
        </Grid>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={snackbarAutoHideDurationMs}
        onClose={() => setError(null)}
      >
        <Alert severity='error'>{error}</Alert>
      </Snackbar>
    </>
  );
};

export default Login;
