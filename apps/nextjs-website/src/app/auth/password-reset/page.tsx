'use client';
import { Alert, Box, Card, Grid, Snackbar } from '@mui/material';
import { isProduction } from '@/config';
import { useCallback, useState } from 'react';
import { translations } from '@/_contents/translations';
import { ValidatorFunction } from '@/components/molecules/RequiredTextField/RequiredTextField';
import { SendResetPasswordSteps } from '@/lib/types/sendResetPasswordSteps';
import { Auth } from 'aws-amplify';
import { emailMatcher } from '@/helpers/auth.helpers';
import { useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/organisms/Auth/ResetPasswordForm';
import ResetPasswordSuccess from '@/components/organisms/Auth/ResetPasswordSuccess';
import PageNotFound from '@/app/not-found';

interface Info {
  message: string;
  isError: boolean;
}

const PasswordReset = () => {
  const [info, setInfo] = useState<Info | null>(null);
  const [email, setEmail] = useState<string>('');
  const [sendResetPasswordSteps, setSendResetPasswordSteps] = useState(
    SendResetPasswordSteps.SEND_EMAIL
  );

  const { shared } = translations;

  const router = useRouter();

  const handleResetPassword = useCallback(async () => {
    const success = await Auth.forgotPassword(email).catch((error) => {
      setInfo({ message: error.message, isError: true });
      return false;
    });

    if (success) {
      setInfo({ message: 'Invio Email in corso...', isError: false });
      setSendResetPasswordSteps(SendResetPasswordSteps.EMAIL_SEND_CONFIRM);
    }
  }, [email]);

  const emailValidators: ValidatorFunction[] = [
    (value: string) => ({
      valid: emailMatcher.test(value),
      error: shared.emailFieldError,
    }),
  ];

  const onBackStep = useCallback(() => {
    router.replace(
      `/auth/password-reset?email=${email}&step=${SendResetPasswordSteps.SEND_EMAIL}`
    );
    setSendResetPasswordSteps(SendResetPasswordSteps.SEND_EMAIL);
    return null;
  }, [router, email]);

  return isProduction ? (
    <PageNotFound />
  ) : (
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
          <Box component='section'>
            <Card variant='elevation' elevation={8}>
              <Grid container justifyContent='center'>
                <Grid item xs={11}>
                  {sendResetPasswordSteps ===
                    SendResetPasswordSteps.SEND_EMAIL && (
                    <ResetPasswordForm
                      email={email}
                      setEmail={setEmail}
                      handleResetPassword={handleResetPassword}
                      emailValidators={emailValidators}
                    />
                  )}
                  {sendResetPasswordSteps ===
                    SendResetPasswordSteps.EMAIL_SEND_CONFIRM && (
                    <ResetPasswordSuccess
                      email={email}
                      onBack={onBackStep}
                      resendEmail={handleResetPassword}
                    />
                  )}
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Grid>
      </Box>
      <Snackbar
        open={!!info}
        autoHideDuration={4000}
        onClose={() => setInfo(null)}
      >
        <Alert severity={info?.isError ? 'error' : 'success'}>
          {info?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PasswordReset;
