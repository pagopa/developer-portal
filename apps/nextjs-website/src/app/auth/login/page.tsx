'use client';
import LoginForm from '@/components/organisms/Auth/LoginForm';
import ConfirmLogIn from '@/components/organisms/Auth/ConfirmLogin';
import { Box, Grid } from '@mui/material';
import { useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';
import { LoginSteps } from '@/lib/types/loginSteps';
import { LoginFunction } from '@/lib/types/loginFunction';
import { useRouter } from 'next/navigation';
import { LoaderPhase } from '@/lib/types/loader';
import { RESET_AFTER_MS } from '@/lib/constants';

const Login = () => {
  const router = useRouter();
  const [logInStep, setLogInStep] = useState(LoginSteps.LOG_IN);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState<LoaderPhase | undefined>(undefined);

  const [invalidCode, setInvalidCode] = useState(false);

  const onLogin: LoginFunction = useCallback(
    async ({ username, password }) => {
      if (logInStep === LoginSteps.MFA_CHALLENGE) {
        setLoader(LoaderPhase.LOADING);
      }

      setUsername(username);
      setPassword(password);

      const user = await Auth.signIn(username, password).catch(() => {
        setLoader(LoaderPhase.ERROR);
        return false;
      });

      if (user) {
        setUser(user);

        if (logInStep === LoginSteps.MFA_CHALLENGE) {
          setLoader(LoaderPhase.SUCCESS);
        }

        setLogInStep(LoginSteps.MFA_CHALLENGE);
        setInvalidCode(false);
      }

      setTimeout(() => {
        setLoader(undefined);
      }, RESET_AFTER_MS);
    },
    [logInStep]
  );

  const resendCode = useCallback(async () => {
    await onLogin({ username, password });
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
        router.replace('/');
      }
    },
    [router, user]
  );

  const onBackStep = useCallback(() => {
    setLogInStep(LoginSteps.LOG_IN);
    return null;
  }, []);

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
            resendLoader={loader}
            onBackStep={onBackStep}
            onResendCode={resendCode}
            onConfirmLogin={confirmLogin}
          />
        )}
      </Grid>
    </Box>
  );
};

export default Login;
