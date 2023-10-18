'use client';
import CheckItem from '@/components/molecules/CheckItem/CheckItem';
import ConfirmSignUp from '@/components/organisms/Auth/ConfirmSignUp';
import SignUpForm from '@/components/organisms/Auth/SignUpForm';
import { SignUpFunction } from '@/lib/types/signUpFunction';
import { SignUpSteps } from '@/lib/types/signUpSteps';
import { Box, Grid, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useCallback, useState } from 'react';

const SignUp = () => {
  const [accountEmail, setAccountEmail] = useState<string>('');
  const [signUpStep, setSignUpStep] = useState(SignUpSteps.SIGN_UP);

  const onSignUp: SignUpFunction = useCallback(
    async ({ username, password, firstName, lastName, company, role }) => {
      // const result = await Auth.signUp({
      //   username,
      //   password,
      //   attributes: {
      //     firstName,
      //     lastName,
      //     company,
      //     role,
      //   },
      // });

      setAccountEmail(username);
      setSignUpStep(SignUpSteps.CONFIRM_SIGN_UP);

      // return !!result.user;
      return true;
    },
    []
  );

  const onBackStep = useCallback(() => {
    setSignUpStep(SignUpSteps.SIGN_UP);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      <Grid
        container
        spacing={6}
        alignItems='flex-start'
        justifyContent='center'
        my={16}
      >
        <Grid item xs={5}>
          <Typography variant='h4' mb={4}>
            Perché iscriversi a PagoPA DevPortal
          </Typography>
          {[1, 2, 3].map((item, index) => {
            return (
              <CheckItem
                key={index}
                title={`Vantaggio ${item}`}
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
              />
            );
          })}
        </Grid>
        <Grid item xs={5}>
          {signUpStep === SignUpSteps.SIGN_UP && (
            <SignUpForm onSignUp={onSignUp} />
          )}
          {signUpStep === SignUpSteps.CONFIRM_SIGN_UP && (
            <ConfirmSignUp email={accountEmail} onBack={onBackStep} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUp;
