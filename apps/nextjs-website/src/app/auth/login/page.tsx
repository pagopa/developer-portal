'use client';
import LoginForm from '@/components/organisms/Auth/LoginForm';
import { Box, Grid } from '@mui/material';
import { isProduction } from '@/config';
import PageNotFound from '@/app/not-found';
import { useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';
import { LoginSteps } from '@/lib/types/loginSteps';
import { LoginFunction } from '@/lib/types/loginFunction';

const Login = () => {
  const [logInStep, setLogInStep] = useState(LoginSteps.LOG_IN);
  const [user, setUser] = useState(null);

  const onLogin: LoginFunction = useCallback(async ({ username, password }) => {
    const user = await Auth.signIn({
      username,
      password,
    });

    setUser(user);
    setLogInStep(LoginSteps.MFA_CHALLENGE);
  }, []);

  const confirmLogin = useCallback(
    async ({ code }: { code: string }) => {
      await Auth.sendCustomChallengeAnswer(user, code);
    },
    [user]
  );

  const onBackStep = useCallback(() => {
    setLogInStep(LoginSteps.LOG_IN);
    return null;
  }, []);

  return isProduction ? (
    <PageNotFound />
  ) : (
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
          // TODO: Create this component
          //<ConfirmLogIn email={accountEmail} onBack={onBackStep} />
          <div>CONFERMA MFA</div>
        )}
      </Grid>
    </Box>
  );
};

export default Login;
