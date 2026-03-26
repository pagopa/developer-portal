'use client';
import { Grid } from '@mui/material';
import PasswordChangedCard from '@/components/organisms/Auth/PasswordChangedCard';
import ChangePasswordForm from '@/components/organisms/Auth/ChangePasswordForm';
import { ResetPasswordSteps } from '@/lib/types/resetPasswordSteps';
import { useCallback, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Auth } from 'aws-amplify';
import PageNotFound from '@/app/[locale]/not-found';
import { useTranslations } from 'next-intl';
import Spinner from '@/components/atoms/Spinner/Spinner';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

enum State {
  loading = 'loading',
  error = 'error',
  errorLink = 'errorLink',
  success = 'success',
}

const ChangePasswordContent = () => {
  const confirmation = useTranslations('auth.confirmation');

  const searchParams = useSearchParams();
  const username = searchParams.get('username') || '';
  const code = searchParams.get('code') || '';

  const [state, setState] = useState<State>(State.loading);
  const [submitting, setSubmitting] = useState(false);
  const [resetPasswordSteps, setResetPasswordSteps] = useState(
    ResetPasswordSteps.CHANGE_PASSWORD
  );

  const onPasswordChanged = useCallback(
    (password: string) => {
      setSubmitting(true);
      Auth.forgotPasswordSubmit(username, code, password)
        .then(() => {
          setResetPasswordSteps(ResetPasswordSteps.CHANGE_PASSWORD_SUCCESS);
        })
        .catch(() => {
          setState(State.errorLink);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [code, username]
  );

  useEffect(() => {
    if (username != '' && code != '') {
      setState(State.success);
    } else {
      setState(State.errorLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (state) {
    case State.error:
      return <PageNotFound />;
    case State.errorLink:
      return (
        <PageBackgroundWrapper>
          <SingleCard
            icon={
              <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />
            }
            title={confirmation('title')}
          />
        </PageBackgroundWrapper>
      );
    case State.success:
      return (
        <PageBackgroundWrapper>
          <Grid
            container
            justifyContent='center'
            sx={{ mx: 'auto', my: '5vh' }}
            spacing={6}
          >
            {resetPasswordSteps === ResetPasswordSteps.CHANGE_PASSWORD ? (
              <ChangePasswordForm
                submitting={submitting}
                onSubmit={onPasswordChanged}
              />
            ) : (
              <PasswordChangedCard />
            )}
          </Grid>
        </PageBackgroundWrapper>
      );
    default:
      return <Spinner />;
  }
};

const ChangePassword = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ChangePasswordContent />
    </Suspense>
  );
};

export default ChangePassword;
