'use client';
import { Grid } from '@mui/material';
import PasswordChangedCard from '@/components/organisms/Auth/PasswordChangedCard';
import ChangePasswordForm from '@/components/organisms/Auth/ChangePasswordForm';
import { ResetPasswordSteps } from '@/lib/types/resetPasswordSteps';
import { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Auth } from 'aws-amplify';
import PageNotFound from '@/app/not-found';
import { useTranslations } from 'next-intl';
import Spinner from '@/components/atoms/Spinner/Spinner';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { IllusError } from '@pagopa/mui-italia/dist/illustrations/Error';

enum State {
  loading = 'loading',
  error = 'error',
  errorLink = 'errorLink',
  success = 'success',
}

const ChangePassword = () => {
  const confirmation = useTranslations('auth.confirmation');

  const searchParams = useSearchParams();
  const username = searchParams.get('username') || '';
  const code = searchParams.get('code') || '';

  const [resetPasswordSteps, setResetPasswordSteps] = useState(
    ResetPasswordSteps.CHANGE_PASSWORD
  );
  const [password, setPassword] = useState('');
  const [state, setState] = useState<State>(State.loading);

  const onChangePassword = useCallback(async () => {
    const success = await Auth.forgotPasswordSubmit(
      username,
      code,
      password
    ).catch(() => {
      setState(State.errorLink);
      return false;
    });

    if (!success) return;

    setResetPasswordSteps(ResetPasswordSteps.CHANGE_PASSWORD_SUCCESS);
  }, [code, password, username]);

  useEffect(() => {
    if (username != '' && code != '') {
      setState(State.success);
    } else {
      setState(State.errorLink);
    }
  }, []);

  switch (state) {
    case State.error:
      return <PageNotFound />;
    case State.errorLink:
      return (
        <PageBackgroundWrapper>
          <SingleCard icon={<IllusError />} title={confirmation('title')} />
        </PageBackgroundWrapper>
      );
    case State.success:
      return (
        <>
          <PageBackgroundWrapper>
            <Grid
              container
              justifyContent='center'
              sx={{ mx: 'auto', my: '5vh' }}
              spacing={6}
            >
              {resetPasswordSteps === ResetPasswordSteps.CHANGE_PASSWORD ? (
                <ChangePasswordForm
                  onChangePassword={onChangePassword}
                  setPassword={setPassword}
                  password={password}
                />
              ) : (
                <PasswordChangedCard />
              )}
            </Grid>
          </PageBackgroundWrapper>
          )
        </>
      );
    default:
      return <Spinner />;
  }
};

export default ChangePassword;
