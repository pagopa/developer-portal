'use client';
import { Typography, Stack, Button, Divider, Link } from '@mui/material';
import { emailMatcher } from '@/helpers/auth.helpers';
import { translations } from '@/_contents/translations';
import RequiredTextField, {
  ValidatorFunction,
} from '@/components/molecules/RequiredTextField/RequiredTextField';
import { IllusDataSecurity } from '@pagopa/mui-italia';
import { Dispatch, SetStateAction } from 'react';

const {
  auth: { resetPassword },
  shared,
} = translations;

interface ResetPasswordFormProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  handleResetPassword: () => Promise<void>;
  emailValidators: ValidatorFunction[];
}

const ResetPasswordForm = ({
  email,
  setEmail,
  handleResetPassword,
  emailValidators,
}: ResetPasswordFormProps) => {
  return (
    <>
      <Stack pt={4} display='flex' alignItems='center'>
        <IllusDataSecurity />
      </Stack>
      <Typography variant='h4' pt={5} mb={4} textAlign='center'>
        {resetPassword.title}
      </Typography>
      <Typography variant='body2' mb={2}>
        {resetPassword.body}
      </Typography>
      <RequiredTextField
        label={shared.emailAddress}
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        helperText={shared.requiredFieldError}
        customValidators={emailValidators}
      />
      <Stack spacing={4} pt={4} pb={2}>
        <Stack direction='row' justifyContent='center'>
          <Button
            variant='contained'
            onClick={handleResetPassword}
            disabled={!emailMatcher.test(email)}
          >
            {resetPassword.send}
          </Button>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        pt={4}
        pb={8}
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='row'
      >
        <Link
          variant='body2'
          href='/auth/login'
          sx={{ fontWeight: 600, cursor: 'pointer' }}
        >
          {resetPassword.goBackToLogin}
        </Link>
      </Stack>
    </>
  );
};

export default ResetPasswordForm;
