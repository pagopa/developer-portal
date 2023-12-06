'use client';
import { Alert, Box, Grid, Snackbar } from '@mui/material';
import { useCallback, useState } from 'react';
import { SendResetPasswordSteps } from '@/lib/types/sendResetPasswordSteps';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/organisms/Auth/ResetPasswordForm';
import ResetPasswordSuccess from '@/components/organisms/Auth/ResetPasswordSuccess';
import { snackbarAutoHideDurationMs } from '@/config';
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

  const onBackStep = useCallback(() => {
    router.replace(
      `/auth/password-reset?email=${email}&step=${SendResetPasswordSteps.SEND_EMAIL}`
    );
    setSendResetPasswordSteps(SendResetPasswordSteps.SEND_EMAIL);
    return null;
  }, [router, email]);

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
          {sendResetPasswordSteps === SendResetPasswordSteps.SEND_EMAIL ? (
            <ResetPasswordForm
              email={email}
              setEmail={setEmail}
              handleResetPassword={handleResetPassword}
            />
          ) : (
            <ResetPasswordSuccess
              email={email}
              onBack={onBackStep}
              resendEmail={handleResetPassword}
            />
          )}
        </Grid>
      </Box>
      <Snackbar
        open={!!info}
        autoHideDuration={snackbarAutoHideDurationMs}
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
