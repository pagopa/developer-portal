'use client';
import LoginForm from '@/components/organisms/Auth/LoginForm';
import ConfirmLogIn from '@/components/organisms/Auth/ConfirmLogin';
import { Grid } from '@mui/material';
import { useCallback, useState, Suspense } from 'react';
import { Auth } from 'aws-amplify';
import { LoginSteps } from '@/lib/types/loginSteps';
import { LoginFunction } from '@/lib/types/loginFunction';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import { useRouter, useSearchParams } from 'next/navigation';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';
import { SignInOpts } from '@aws-amplify/auth/lib/types';
import AuthStatus from '@/components/organisms/Auth/AuthStatus';
import Spinner from '@/components/atoms/Spinner/Spinner';

const LoginContent = () => {
  const router = useRouter();
  const [logInStep, setLogInStep] = useState(LoginSteps.LOG_IN);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [noAccountError, setNoAccountError] = useState<boolean>(false);

  const onLogin: LoginFunction = useCallback(async ({ username, password }) => {
    setSubmitting(true);
    setNoAccountError(false);
    setLoginData({ username, password });

    const opts: SignInOpts = { username, password };
    const user = await Auth.signIn(opts)
      .catch((error) => {
        if (error.code === 'UserNotConfirmedException') {
          setLogInStep(LoginSteps.CONFIRM_ACCOUNT);
        } else {
          setNoAccountError(true);
        }
        return false;
      })
      .finally(() => {
        setSubmitting(false);
      });

    if (user) {
      setUser(user);
      setLogInStep(LoginSteps.MFA_CHALLENGE);
    }
  }, []);

  const resendCode = useCallback(async () => {
    const result = await onLogin(loginData)
      .then(() => true)
      .catch(() => false);

    return result;
  }, [onLogin, loginData]);

  const searchParams = useSearchParams();

  const confirmLogin = useCallback(
    async (code: string) => {
      await Auth.sendCustomChallengeAnswer(user, code);

      const redirect = searchParams.get('redirect');
      router.replace(redirect ? atob(redirect) : '/');
    },
    [router, searchParams, user]
  );

  const onBackStep = () => {
    setLogInStep(LoginSteps.LOG_IN);
  };

  return (
    <PageBackgroundWrapper>
      <Grid
        container
        justifyContent='center'
        sx={{ mx: 'auto' }}
        my={6}
        spacing={6}
      >
        {logInStep === LoginSteps.LOG_IN && (
          <AuthStatus>
            <LoginForm
              submitting={submitting}
              noAccount={noAccountError}
              onLogin={onLogin}
            />
          </AuthStatus>
        )}
        {logInStep === LoginSteps.MFA_CHALLENGE && (
          <ConfirmLogIn
            email={loginData.username}
            onConfirmLogin={confirmLogin}
            resendCode={resendCode}
          />
        )}
        {logInStep === LoginSteps.CONFIRM_ACCOUNT && (
          <ConfirmSignUp email={loginData.username} onBack={onBackStep} />
        )}
      </Grid>
    </PageBackgroundWrapper>
  );
};

const Login = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
