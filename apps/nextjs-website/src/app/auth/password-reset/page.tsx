'use client';

import { Grid } from '@mui/material';
import { useCallback, useState } from 'react';
import { SendResetPasswordSteps } from '@/lib/types/sendResetPasswordSteps';
import { Auth } from 'aws-amplify';

import ResetPasswordForm from '@/components/organisms/Auth/ResetPasswordForm';
import ResetPasswordSuccess from '@/components/organisms/Auth/ResetPasswordSuccess';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';

const PasswordReset = () => {
  const [email, setEmail] = useState<string>('');
  const [sendResetPasswordSteps, setSendResetPasswordSteps] = useState(
    SendResetPasswordSteps.SEND_EMAIL
  );

  const handleResetPassword = useCallback(async () => {
    const success = await Auth.forgotPassword(email).catch(() => {
      return false;
    });

    if (success) {
      setSendResetPasswordSteps(SendResetPasswordSteps.EMAIL_SEND_CONFIRM);
    }
  }, [email]);

  const onBackStep = useCallback(() => {
    setSendResetPasswordSteps(SendResetPasswordSteps.SEND_EMAIL);
    return null;
  }, []);

  return (
    <PageBackgroundWrapper>
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
    </PageBackgroundWrapper>
  );
};

export default PasswordReset;
