'use client';
import { Alert, Box, Grid, Snackbar } from '@mui/material';
import PasswordChangedCard from '@/components/organisms/Auth/PasswordChangedCard';
import ChangePasswordForm from '@/components/organisms/Auth/ChangePasswordForm';
import { ResetPasswordSteps } from '@/lib/types/resetPasswordSteps';
import { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Auth } from 'aws-amplify';
import PageNotFound from '@/app/not-found';
import { RESET_AFTER_MS } from '@/config';
import { useTranslations } from 'next-intl';

const ChangePassword = () => {
  const resetPassword = useTranslations('auth.resetPassword');
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || '';
  const code = searchParams.get('code') || '';

  const [resetPasswordSteps, setResetPasswordSteps] = useState(
    ResetPasswordSteps.CHANGE_PASSWORD
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(false);

  const onChangePassword = useCallback(async () => {
    const success = await Auth.forgotPasswordSubmit(
      username,
      code,
      password
    ).catch((err) => {
      setError(err.message);
      return false;
    });

    if (!success) return;

    setResetPasswordSteps(ResetPasswordSteps.CHANGE_PASSWORD_SUCCESS);
  }, [code, password, username]);

  useEffect(() => {
    if (username != '' && code != '') {
      setIsValidLink(true);
    } else {
      setError(resetPassword('invalidLinkError'));
    }
  }, []);

  return (
    <>
      {isValidLink ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            minHeight: '70vh',
            backgroundImage: 'url(/images/hero.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom right',
          }}
        >
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
        </Box>
      ) : (
        <PageNotFound />
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={RESET_AFTER_MS}
        onClose={() => setError(null)}
      >
        <Alert severity={'error'}>{error}</Alert>
      </Snackbar>
    </>
  );
};

export default ChangePassword;
