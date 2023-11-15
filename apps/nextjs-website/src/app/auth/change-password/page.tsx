'use client';
import { Box } from '@mui/material';
import PasswordChangedCard from '@/components/organisms/Auth/PasswordChangedCard';
import { ResetPasswordSteps } from '@/lib/types/resetPasswordSteps';
import { useState } from 'react';

const ChangePassword = () => {
  const [resetPasswordStep, setResetPasswordStep] = useState(
    ResetPasswordSteps.CHANGE_PASSWORD
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        minHeight: '616px',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      <PasswordChangedCard />
    </Box>
  );
};

export default ChangePassword;
