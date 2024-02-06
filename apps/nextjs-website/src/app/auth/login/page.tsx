'use client';
import LoginForm from '@/components/organisms/Auth/LoginForm';
import ConfirmLogIn from '@/components/organisms/Auth/ConfirmLogin';
import { Grid } from '@mui/material';
import { useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';
import { LoginSteps } from '@/lib/types/loginSteps';
import { LoginFunction } from '@/lib/types/loginFunction';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import { useRouter, useSearchParams } from 'next/navigation';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';

const Login = () => {
  const router = useRouter();
  const [logInStep, setLogInStep] = useState(LoginSteps.LOG_IN);
  const [user, setUser] = useState(null);
  const [noAccount, setNoAccount] = useState<boolean>(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLogin: LoginFunction = useCallback(async ({ username, password }) => {
    setNoAccount(false);
    setUsername(username);
    setPassword(password);

    const user = await Auth.signIn({
      username,
      password,
    }).catch((error) => {
      if (error.code === 'UserNotConfirmedException') {
        setUsername(username);
        setLogInStep(LoginSteps.CONFIRM_ACCOUNT);
      } else {
        setNoAccount(true);
      }
      return false;
    });

    setUsername(username);

    if (user) {
      setUser(user);
      setLogInStep(LoginSteps.MFA_CHALLENGE);
    }
  }, []);

  const resendCode = useCallback(async () => {
    const result = await onLogin({ username, password })
      .then(() => true)
      .catch(() => false);

    return result;
  }, [onLogin, password, username]);

  const searchParams = useSearchParams();

  const confirmLogin = useCallback(
    async (code: string) => {
      await Auth.sendCustomChallengeAnswer(user, code);

      const redirect = searchParams.get('redirect');
      router.replace(redirect ? redirect : '/');
    },
    [router, searchParams, user]
  );

  const onBackStep = useCallback(() => {
    router.replace(
      `/auth/login?email=${encodeURIComponent(username || '')}&step=${
        LoginSteps.LOG_IN
      }`
    );
    setLogInStep(LoginSteps.LOG_IN);
    return null;
  }, [router, username]);

  return (
    <>
      <PageBackgroundWrapper>
        <Grid
          container
          justifyContent='center'
          sx={{ mx: 'auto' }}
          my={6}
          spacing={6}
        >
          {logInStep === LoginSteps.LOG_IN && (
            <LoginForm noAccount={noAccount} onLogin={onLogin} />
          )}
          {logInStep === LoginSteps.MFA_CHALLENGE && (
            <ConfirmLogIn
              email={username}
              onConfirmLogin={confirmLogin}
              resendCode={resendCode}
            />
          )}
          {logInStep === LoginSteps.CONFIRM_ACCOUNT && (
            <ConfirmSignUp email={username || ''} onBack={onBackStep} />
          )}
        </Grid>
      </PageBackgroundWrapper>
    </>
  );
};

export default Login;
